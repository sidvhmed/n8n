// Mapping des dossiers vers les types de métadonnées selon PropertyGroups.xml
// (repris de ton code, gardé compatible)

const METADATA_MAPPING = {
  fiche_immeuble_cadastre: {
    groupName: "okg:fiche_immeuble_cadastre",
    tableName: "fiche_immeuble_cadastre",
    properties: {
      "okp:fiche_immeuble_cadastre.id": "id",
      "okp:fiche_immeuble_cadastre.designation": "designation",
      "okp:fiche_immeuble_cadastre.conservation": "conservation",
      "okp:fiche_immeuble_cadastre.commune": "comm",
      "okp:fiche_immeuble_cadastre.secteur": "sect",
      "okp:fiche_immeuble_cadastre.ilot": "ilot",
      "okp:fiche_immeuble_cadastre.lot": "lot",
      "okp:fiche_immeuble_cadastre.numero_batiment": "numbatiment",
      "okp:fiche_immeuble_cadastre.entree_batiment": "entbatiment",
      "okp:fiche_immeuble_cadastre.utilisateur_creation": "user_create",
      "okp:fiche_immeuble_cadastre.date_creation": "date_create",
      "okp:fiche_immeuble_cadastre.utilisateur_maj": "user_miseajour",
      "okp:fiche_immeuble_cadastre.date_maj": "date_miseajour",
      "okp:fiche_immeuble_cadastre.utilisateur_suppression": "user_supp",
      "okp:fiche_immeuble_cadastre.date_suppression": "date_supp",
      "okp:fiche_immeuble_cadastre.code_conservation_origine": "code_conservation_origine_insert",
      "okp:fiche_immeuble_cadastre.contenu_document": "doccontenu"
    }
  },
  fiche_immeuble_non_cadastre: {
    groupName: "okg:fiche_immeuble_non_cadastre",
    tableName: "fiche_immeuble_non_cadastre",
    properties: {
      "okp:fiche_immeuble_non_cadastre.id": "id",
      "okp:fiche_immeuble_non_cadastre.designation": "designation",
      "okp:fiche_immeuble_non_cadastre.conservation": "conservation",
      "okp:fiche_immeuble_non_cadastre.commune": "comm",
      "okp:fiche_immeuble_non_cadastre.lot": "lot",
      "okp:fiche_immeuble_non_cadastre.adresse": "adresse",
      "okp:fiche_immeuble_non_cadastre.lieu_dite": "lieu_dite",
      "okp:fiche_immeuble_non_cadastre.utilisateur_creation": "user_create",
      "okp:fiche_immeuble_non_cadastre.date_creation": "date_create",
      "okp:fiche_immeuble_non_cadastre.utilisateur_maj": "user_miseajour",
      "okp:fiche_immeuble_non_cadastre.date_maj": "date_miseajour",
      "okp:fiche_immeuble_non_cadastre.utilisateur_suppression": "user_supp",
      "okp:fiche_immeuble_non_cadastre.date_suppression": "date_supp",
      "okp:fiche_immeuble_non_cadastre.code_conservation_origine": "code_conservation_origine_insert",
      "okp:fiche_immeuble_non_cadastre.contenu_document": "doccontenu"
    }
  },
  fiche_immeuble_cadastre_historique: {
    groupName: "okg:fiche_immeuble_cadastre_historique",
    tableName: "fiche_immeuble_cadastre_historique",
    properties: {
      "okp:fiche_immeuble_cadastre_historique.id_document": "id",
      "okp:fiche_immeuble_cadastre_historique.designation": "designation",
      "okp:fiche_immeuble_cadastre_historique.conservation": "conservation",
      "okp:fiche_immeuble_cadastre_historique.commune": "comm",
      "okp:fiche_immeuble_cadastre_historique.secteur": "sect",
      "okp:fiche_immeuble_cadastre_historique.ilot": "ilot",
      "okp:fiche_immeuble_cadastre_historique.lot": "lot",
      "okp:fiche_immeuble_cadastre_historique.numero_batiment": "numbatiment",
      "okp:fiche_immeuble_cadastre_historique.entree_batiment": "entbatiment",
      "okp:fiche_immeuble_cadastre_historique.utilisateur_creation": "user_create",
      "okp:fiche_immeuble_cadastre_historique.date_creation": "date_create",
      "okp:fiche_immeuble_cadastre_historique.utilisateur_suppression": "user_supp",
      "okp:fiche_immeuble_cadastre_historique.date_suppression": "date_supp",
      "okp:fiche_immeuble_cadastre_historique.code_conservation_origine": "code_conservation_origine_insert",
      "okp:fiche_immeuble_cadastre_historique.date_insertion_origine": "timestamp_insertion_origine",
      "okp:fiche_immeuble_cadastre_historique.contenu_document": "doccontenu"
    }
  },
  fiche_personnel: {
    groupName: "okg:fiche_personnel",
    tableName: "fiche_personnel",
    properties: {
      "okp:fiche_personnel.id": "id",
      "okp:fiche_personnel.designation": "designation",
      "okp:fiche_personnel.doccontenu": "doccontenu",
      "okp:fiche_personnel.code_pers": "code_pers",
      "okp:fiche_personnel.conservation": "conservation",
      "okp:fiche_personnel.user_create": "user_create",
      "okp:fiche_personnel.date_create": "date_create",
      "okp:fiche_personnel.user_supp": "user_supp",
      "okp:fiche_personnel.date_supp": "date_supp",
      "okp:fiche_personnel.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:fiche_personnel.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  },
  fiche_personnel_non_saisie: {
    groupName: "okg:fiche_personnel_non_saisie",
    tableName: "fiche_personnelnonsaisie",
    properties: {
      "okp:fiche_personnel_non_saisie.id": "id",
      "okp:fiche_personnel_non_saisie.doccontenu": "doccontenu",
      "okp:fiche_personnel_non_saisie.designation": "designation",
      "okp:fiche_personnel_non_saisie.code_pers": "code_pers",
      "okp:fiche_personnel_non_saisie.conservation": "conservation",
      "okp:fiche_personnel_non_saisie.user_create": "user_create",
      "okp:fiche_personnel_non_saisie.date_create": "date_create",
      "okp:fiche_personnel_non_saisie.user_supp": "user_supp",
      "okp:fiche_personnel_non_saisie.date_supp": "date_supp",
      "okp:fiche_personnel_non_saisie.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:fiche_personnel_non_saisie.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  },
  fiche_radiation: {
    groupName: "okg:fiche_radiation",
    tableName: "fiche_radiation",
    properties: {
      "okp:fiche_radiation.id": "id",
      "okp:fiche_radiation.designation": "designation",
      "okp:fiche_radiation.conservation": "conservation",
      "okp:fiche_radiation.doccontenu": "doccontenu",
      "okp:fiche_radiation.vol_pub": "vol_pub",
      "okp:fiche_radiation.num_pub": "num_pub",
      "okp:fiche_radiation.bis": "bis",
      "okp:fiche_radiation.date_pub": "date_pub",
      "okp:fiche_radiation.dep_num": "dep_num",
      "okp:fiche_radiation.num_seq": "num_seq",
      "okp:fiche_radiation.user_create": "user_create",
      "okp:fiche_radiation.date_create": "date_create",
      "okp:fiche_radiation.user_supp": "user_supp",
      "okp:fiche_radiation.date_supp": "date_supp",
      "okp:fiche_radiation.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:fiche_radiation.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  },
  fiche_rural_cadastre: {
    groupName: "okg:fiche_rural_cadastre",
    tableName: "fiche_rural_cadastre",
    properties: {
      "okp:fiche_rural_cadastre.id": "id",
      "okp:fiche_rural_cadastre.doccontenu": "doccontenu",
      "okp:fiche_rural_cadastre.designation": "designation",
      "okp:fiche_rural_cadastre.conservation": "conservation",
      "okp:fiche_rural_cadastre.comm": "comm",
      "okp:fiche_rural_cadastre.sect": "sect",
      "okp:fiche_rural_cadastre.ilot": "ilot",
      "okp:fiche_rural_cadastre.lot": "lot",
      "okp:fiche_rural_cadastre.user_create": "user_create",
      "okp:fiche_rural_cadastre.date_create": "date_create",
      "okp:fiche_rural_cadastre.user_supp": "user_supp",
      "okp:fiche_rural_cadastre.date_supp": "date_supp",
      "okp:fiche_rural_cadastre.user_miseajour": "user_miseajour",
      "okp:fiche_rural_cadastre.date_miseajour": "date_miseajour",
      "okp:fiche_rural_cadastre.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:fiche_rural_cadastre.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  },
  formalite: {
    groupName: "okg:formalite",
    tableName: "formalite",
    properties: {
      "okp:formalite.id": "id",
      "okp:formalite.designation": "designation",
      "okp:formalite.conservation": "conservation",
      "okp:formalite.doccontenu": "doccontenu",
      "okp:formalite.vol_pub": "vol_pub",
      "okp:formalite.num_pub": "num_pub",
      "okp:formalite.date_pub": "date_pub",
      "okp:formalite.dep_num": "dep_num",
      "okp:formalite.num_seq": "num_seq",
      "okp:formalite.user_create": "user_create",
      "okp:formalite.date_create": "date_create",
      "okp:formalite.user_supp": "user_supp",
      "okp:formalite.date_supp": "date_supp",
      "okp:formalite.bis": "bis",
      "okp:formalite.user_miseajour": "user_miseajour",
      "okp:formalite.date_miseajour": "date_miseajour",
      "okp:formalite.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:formalite.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  },
  hypotheque: {
    groupName: "okg:hypotheque",
    tableName: "hypotheque",
    properties: {
      "okp:hypotheque.id": "id",
      "okp:hypotheque.designation": "designation",
      "okp:hypotheque.conservation": "conservation",
      "okp:hypotheque.doccontenu": "doccontenu",
      "okp:hypotheque.vol_pub": "vol_pub",
      "okp:hypotheque.num_pub": "num_pub",
      "okp:hypotheque.date_pub": "date_pub",
      "okp:hypotheque.dep_num": "dep_num",
      "okp:hypotheque.num_seq": "num_seq",
      "okp:hypotheque.user_create": "user_create",
      "okp:hypotheque.date_create": "date_create",
      "okp:hypotheque.user_supp": "user_supp",
      "okp:hypotheque.date_supp": "date_supp",
      "okp:hypotheque.bis": "bis",
      "okp:hypotheque.user_miseajour": "user_miseajour",
      "okp:hypotheque.date_miseajour": "date_miseajour",
      "okp:hypotheque.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:hypotheque.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  },
  requete: {
    groupName: "okg:requete",
    tableName: "requete",
    properties: {
      "okp:requete.id": "id",
      "okp:requete.designation": "designation",
      "okp:requete.conservation": "conservation",
      "okp:requete.doccontenu": "doccontenu",
      "okp:requete.vol_pub": "vol_pub",
      "okp:requete.num_pub": "num_pub",
      "okp:requete.date_pub": "date_pub",
      "okp:requete.dep_num": "dep_num",
      "okp:requete.num_seq": "num_seq",
      "okp:requete.user_create": "user_create",
      "okp:requete.date_create": "date_create",
      "okp:requete.user_supp": "user_supp",
      "okp:requete.date_supp": "date_supp",
      "okp:requete.bis": "bis",
      "okp:requete.user_miseajour": "user_miseajour",
      "okp:requete.date_miseajour": "date_miseajour",
      "okp:requete.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:requete.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  },
  saisie: {
    groupName: "okg:saisie",
    tableName: "saisie",
    properties: {
      "okp:saisie.id": "id",
      "okp:saisie.designation": "designation",
      "okp:saisie.conservation": "conservation",
      "okp:saisie.doccontenu": "doccontenu",
      "okp:saisie.vol_pub": "vol_pub",
      "okp:saisie.num_pub": "num_pub",
      "okp:saisie.date_pub": "date_pub",
      "okp:saisie.dep_num": "dep_num",
      "okp:saisie.num_seq": "num_seq",
      "okp:saisie.user_create": "user_create",
      "okp:saisie.date_create": "date_create",
      "okp:saisie.user_supp": "user_supp",
      "okp:saisie.date_supp": "date_supp",
      "okp:saisie.bis": "bis",
      "okp:saisie.user_miseajour": "user_miseajour",
      "okp:saisie.date_miseajour": "date_miseajour",
      "okp:saisie.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:saisie.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  },
  formalite_historique: {
    groupName: "okg:formalite_historique",
    tableName: "formalite_historique",
    properties: {
      "okp:formalite_historique.id": "id",
      "okp:formalite_historique.designation": "designation",
      "okp:formalite_historique.conservation": "conservation",
      "okp:formalite_historique.doccontenu": "doccontenu",
      "okp:formalite_historique.vol_pub": "vol_pub",
      "okp:formalite_historique.num_pub": "num_pub",
      "okp:formalite_historique.date_pub": "date_pub",
      "okp:formalite_historique.dep_num": "dep_num",
      "okp:formalite_historique.num_seq": "num_seq",
      "okp:formalite_historique.user_create": "user_create",
      "okp:formalite_historique.date_create": "date_create",
      "okp:formalite_historique.user_supp": "user_supp",
      "okp:formalite_historique.date_supp": "date_supp",
      "okp:formalite_historique.bis": "bis",
      "okp:formalite_historique.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:formalite_historique.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  },
  hypotheque_historique: {
    groupName: "okg:hypotheque_historique",
    tableName: "hypotheque_historique",
    properties: {
      "okp:hypotheque_historique.id": "id",
      "okp:hypotheque_historique.designation": "designation",
      "okp:hypotheque_historique.conservation": "conservation",
      "okp:hypotheque_historique.doccontenu": "doccontenu",
      "okp:hypotheque_historique.vol_pub": "vol_pub",
      "okp:hypotheque_historique.num_pub": "num_pub",
      "okp:hypotheque_historique.date_pub": "date_pub",
      "okp:hypotheque_historique.dep_num": "dep_num",
      "okp:hypotheque_historique.num_seq": "num_seq",
      "okp:hypotheque_historique.user_create": "user_create",
      "okp:hypotheque_historique.date_create": "date_create",
      "okp:hypotheque_historique.user_supp": "user_supp",
      "okp:hypotheque_historique.date_supp": "date_supp",
      "okp:hypotheque_historique.bis": "bis",
      "okp:hypotheque_historique.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:hypotheque_historique.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  },
  requete_historique: {
    groupName: "okg:requete_historique",
    tableName: "requete_historique",
    properties: {
      "okp:requete_historique.id": "id",
      "okp:requete_historique.designation": "designation",
      "okp:requete_historique.conservation": "conservation",
      "okp:requete_historique.doccontenu": "doccontenu",
      "okp:requete_historique.vol_pub": "vol_pub",
      "okp:requete_historique.num_pub": "num_pub",
      "okp:requete_historique.date_pub": "date_pub",
      "okp:requete_historique.dep_num": "dep_num",
      "okp:requete_historique.num_seq": "num_seq",
      "okp:requete_historique.user_create": "user_create",
      "okp:requete_historique.date_create": "date_create",
      "okp:requete_historique.user_supp": "user_supp",
      "okp:requete_historique.date_supp": "date_supp",
      "okp:requete_historique.bis": "bis",
      "okp:requete_historique.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:requete_historique.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  },
  saisie_historique: {
    groupName: "okg:saisie_historique",
    tableName: "saisie_historique",
    properties: {
      "okp:saisie_historique.id": "id",
      "okp:saisie_historique.designation": "designation",
      "okp:saisie_historique.conservation": "conservation",
      "okp:saisie_historique.doccontenu": "doccontenu",
      "okp:saisie_historique.vol_pub": "vol_pub",
      "okp:saisie_historique.num_pub": "num_pub",
      "okp:saisie_historique.date_pub": "date_pub",
      "okp:saisie_historique.dep_num": "dep_num",
      "okp:saisie_historique.num_seq": "num_seq",
      "okp:saisie_historique.user_create": "user_create",
      "okp:saisie_historique.date_create": "date_create",
      "okp:saisie_historique.user_supp": "user_supp",
      "okp:saisie_historique.date_supp": "date_supp",
      "okp:saisie_historique.bis": "bis",
      "okp:saisie_historique.code_conservation_origine_insert": "code_conservation_origine_insert",
      "okp:saisie_historique.timestamp_insertion_origine": "timestamp_insertion_origine"
    }
  }
};

function detectMetadataType(folderPath) {
  const pathParts = folderPath.split("/").filter((p) => p && p !== "okm:root");
  const folderName = pathParts[pathParts.length - 1];
  const metadataTypeKey = Object.keys(METADATA_MAPPING).find(
    (key) => key.toLowerCase() === String(folderName || "").toLowerCase(),
  );
  return metadataTypeKey ? METADATA_MAPPING[metadataTypeKey] : null;
}

function extractConservationCode(folderPath, tableName) {
  const pathParts = folderPath.split("/").filter((p) => p && p !== "okm:root");
  if (pathParts.length === 0) return null;

  const lastPart = pathParts[pathParts.length - 1];
  const secondLastPart = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : null;

  if (lastPart.toLowerCase() === tableName.toLowerCase() && secondLastPart) {
    return secondLastPart.toUpperCase();
  }
  if (pathParts.length === 1 && lastPart.toLowerCase() !== tableName.toLowerCase()) {
    return lastPart.toUpperCase();
  }
  return null;
}

module.exports = {
  METADATA_MAPPING,
  detectMetadataType,
  extractConservationCode,
};

