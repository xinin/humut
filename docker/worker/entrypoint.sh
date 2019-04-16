#!/bin/sh

host=${COORDINATOR_HOST}/status

until curl -s ${host}; do
  >&2 echo "Coordinator is unavailable - sleeping"
  sleep 1
done

echo "🐋  Starting ..."

if [ ! -z "$ISLOCAL" ];
then
    echo "NODEMON"
    npm i -g nodemon
    nodemon index.js
else
    node index.js
fi

exit 0;