#!/bin/bash
set -e

SERVER="nextjs-user@outlayer.ai"
REMOTE_DIR="/home/nextjs-user/code/outlayer.ai"
SERVICE_NAME="outlayer-landing"

echo "=== Publishing outlayer.ai ==="

# Sync files
echo "Syncing files..."
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  ./ ${SERVER}:${REMOTE_DIR}/

# Install deps & restart app
echo "Installing dependencies and restarting..."
ssh ${SERVER} "cd ${REMOTE_DIR} && npm install --production"

# Setup systemd + nginx (needs sudo)
echo "Configuring service and nginx..."
ssh ${SERVER} << 'REMOTE'
cd /home/nextjs-user/code/outlayer.ai
sudo cp outlayer-landing.service /etc/systemd/system/outlayer-landing.service
sudo systemctl daemon-reload
sudo systemctl enable outlayer-landing
sudo systemctl restart outlayer-landing

sudo cp nginx.conf /etc/nginx/sites-available/outlayer.ai
sudo ln -sf /etc/nginx/sites-available/outlayer.ai /etc/nginx/sites-enabled/outlayer.ai
sudo nginx -t && sudo systemctl reload nginx
REMOTE

echo "=== Done! Site live at https://outlayer.ai ==="
