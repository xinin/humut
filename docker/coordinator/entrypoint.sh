#!/bin/sh

echo "🐋  Starting ..."

if [ ! -z "$ISLOCAL" ];
then
    echo "NODEMON EXEC"
    nodemon server/index.js
else
    node server/index.js
fi

#exit 0;