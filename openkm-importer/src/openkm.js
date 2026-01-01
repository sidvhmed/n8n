const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { OPENKM_CONFIG, httpAgent, httpsAgent, IMPORT_OPTIONS_DEFAULTS } = require("./config");

function basicAuthHeader() {
  const token = Buffer.from(
    `${OPENKM_CONFIG.auth.username}:${OPENKM_CONFIG.auth.password}`,
    "utf8",
  ).toString("base64");
  return `Basic ${token}`;
}

// Axios instance with keep-alive + no body size limits (important for big files)
const axiosInstance = axios.create({
  httpAgent,
  httpsAgent,
  timeout: 30000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
});

function escapeXml(unsafe) {
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function createFolder(folderPath) {
  const response = await axiosInstance.post(
    `${OPENKM_CONFIG.baseUrl}/folder/createSimple`,
    null,
    {
      params: { fldPath: folderPath },
      headers: { Authorization: basicAuthHeader() },
      timeout: 30000,
    },
  );
  return response.data;
}

async function uploadDocument({ tmpPath, docPath, timeoutMs }) {
  const formData = new FormData();
  formData.append("content", fs.createReadStream(tmpPath));
  formData.append("docPath", docPath);

  const response = await axiosInstance.post(
    `${OPENKM_CONFIG.baseUrl}/document/createSimple`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Authorization: basicAuthHeader(),
      },
      timeout: timeoutMs ?? IMPORT_OPTIONS_DEFAULTS.uploadTimeoutMs,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    },
  );

  const documentId = response.data?.uuid || response.data?.path;
  return { documentId, raw: response.data };
}

function buildSimplePropertiesXmlFromMapping(metadata, propertiesMapping, { docContenuMaxChars }) {
  let propertiesXml = '<?xml version="1.0" encoding="UTF-8"?><simplePropertiesGroup>';

  for (const [key, value] of Object.entries(metadata || {})) {
    if (value === undefined || value === null) continue;

    // Optionally truncate doccontenu (huge perf gain)
    let finalValue = value;
    if (
      docContenuMaxChars > 0 &&
      (key === "doccontenu" || key === "contenu_document" || key === "contenu") &&
      typeof value === "string" &&
      value.length > docContenuMaxChars
    ) {
      finalValue = value.slice(0, docContenuMaxChars);
    }

    const propEntry = Object.entries(propertiesMapping).find(([k]) => k.endsWith(`.${key}`));
    if (!propEntry) continue;

    propertiesXml +=
      `<simplePropertyGroup>` +
      `<name>${escapeXml(propEntry[0])}</name>` +
      `<value>${escapeXml(finalValue.toString())}</value>` +
      `</simplePropertyGroup>`;
  }

  propertiesXml += "</simplePropertiesGroup>";
  return propertiesXml;
}

async function setPropertiesSimple({ documentId, groupName, propertiesXml, timeoutMs }) {
  const response = await axiosInstance.put(
    `${OPENKM_CONFIG.baseUrl}/propertyGroup/setPropertiesSimple`,
    propertiesXml,
    {
      params: { nodeId: documentId, grpName: groupName },
      headers: {
        "Content-Type": "application/xml",
        Authorization: basicAuthHeader(),
      },
      timeout: timeoutMs ?? IMPORT_OPTIONS_DEFAULTS.metadataTimeoutMs,
    },
  );
  return response.data;
}

module.exports = {
  axiosInstance,
  escapeXml,
  createFolder,
  uploadDocument,
  buildSimplePropertiesXmlFromMapping,
  setPropertiesSimple,
};

