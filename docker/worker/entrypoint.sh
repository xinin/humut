#!/bin/sh

host=${COORDINATOR_HOST}/status

until curl -s ${host}; do
  >&2 echo "Coordinator is unavailable - sleeping"
  sleep 5
done

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