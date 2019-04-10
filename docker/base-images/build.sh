#!/bin/bash

root=$(pwd)

for image in ${root}/*;
do
    if [ -d $image ]; then
        cd ${image}
        name=$(basename `pwd`)
        echo 'Building '${name}
        sh ${image}/build.sh
    fi
done;