#!/bin/bash
set -e

SERVICE_NAME="outlayer-landing"
SERVICE_FILE="outlayer-landing.service"

echo "=== Setting up ${SERVICE_NAME} service ==="

sudo cp "${SERVICE_FILE}" "/etc/systemd/system/${SERVICE_FILE}"
sudo systemctl daemon-reload
sudo systemctl enable "${SERVICE_NAME}"
sudo systemctl start "${SERVICE_NAME}"

echo "=== Done! Service status: ==="
sudo systemctl status "${SERVICE_NAME}" --no-pager
