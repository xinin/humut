#!/bin/sh

host=${COORDINATOR_HOST}/status

until curl -s ${host}; do
  >&2 echo "Coordinator is unavailable - sleeping"
  sleep 5
done

echo "🐋  Starting ..."

if [ ! -z "$ISLOCAL" ];
then
    echo "NODEMON EXEC"
    nodemon --watch /app /app/index.js
else
    node index.js
fi

exit 0;