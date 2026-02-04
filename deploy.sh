#!/bin/bash

if [ "$1" == "--deploy" ]; then
    su - nextjs-user -s /bin/bash -c '
        cd code/outlayer.ai && \
        git pull && npm install --omit=dev
    '

    if [ $? -eq 0 ]; then
        echo "Deploy completed successfully. Restarting outlayer-landing service..."
        systemctl restart outlayer-landing
    else
        echo "Deploy failed. Not restarting service."
        exit 1
    fi
else
    su - nextjs-user -s /bin/bash
fi
