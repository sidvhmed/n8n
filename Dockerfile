FROM n8nio/n8n:latest

# Set working directory
WORKDIR /data

# Expose n8n port
EXPOSE 5678

# Start n8n with full path
CMD ["node", "/usr/local/lib/node_modules/n8n/bin/n8n"]
