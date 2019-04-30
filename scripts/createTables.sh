aws dynamodb list-tables --endpoint http://localhost:8000

aws dynamodb delete-table --table-name Item --endpoint http://localhost:8000

aws dynamodb create-table --table-name Item \
    --attribute-definitions AttributeName=url,AttributeType=S \
    --key-schema AttributeName=url,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint http://localhost:8000

aws dynamodb delete-table --table-name Price --endpoint http://localhost:8000

aws dynamodb create-table --table-name Price \
    --attribute-definitions AttributeName=url,AttributeType=S AttributeName=timestamp,AttributeType=N \
    --key-schema AttributeName=url,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint http://localhost:8000

aws dynamodb list-tables --endpoint http://localhost:8000