#!/bin/bash
set -e

SERVER="outlayer.ai"
REMOTE_DIR="/opt/outlayer.ai"
SERVICE_NAME="outlayer-landing"

echo "=== Publishing outlayer.ai ==="

# Sync files
echo "Syncing files..."
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  ./ root@${SERVER}:${REMOTE_DIR}/

# Install deps & restart
echo "Installing dependencies and restarting..."
ssh root@${SERVER} "cd ${REMOTE_DIR} && npm install --production && systemctl restart ${SERVICE_NAME}"

echo "=== Done! Site live at https://outlayer.ai ==="
