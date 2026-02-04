#!/bin/bash
set -e

SERVICE_NAME="outlayer-landing"

echo "=== Deploying outlayer.ai ==="

git pull
npm install --production

sudo systemctl restart "${SERVICE_NAME}"

echo "=== Done! Service status: ==="
sudo systemctl status "${SERVICE_NAME}" --no-pager
