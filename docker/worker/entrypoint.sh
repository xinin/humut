#!/bin/sh

host=${COORDINATOR_HOST}/status

until curl -s ${host}; do
  >&2 echo "Coordinator is unavailable - sleeping"
  sleep 1
done

echo "🐋  Starting ..."

node index.js

exit 0;