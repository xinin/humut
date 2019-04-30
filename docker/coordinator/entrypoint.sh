#!/bin/sh

echo "🐋  Starting ..."

if [ ! -z "$ISLOCAL" ];
then
    echo "👀 Watching files ..."
    #nodemon --watch /app /app/index.js
    pm2-runtime start /app/ecosystem.config.js --watch
else
    # TODO check pm2+ for monitoring
    pm2-runtime start /app/ecosystem.config.js
fi