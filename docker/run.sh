#https://github.com/nojhan/colout

root=$(pwd)

function up {
    docker-compose up \
    | colout "humut-dynamo-local" white \
    | colout "dynamo-ui" white \
    | colout "hummut_coordinator" yellow \
    | colout "hummut_worker0" green \
    | colout "hummut_worker1" cyan
}

function noCache {
    docker-compose build --no-cache
}

if [ $# -eq 0 ]
  then
    up
else
    if [ $1 == '--no-cache' ]
    then    
        noCache
    else
        echo "Not implemented"
    fi
    up
fi
