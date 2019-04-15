aws dynamodb list-tables --endpoint http://localhost:8000

aws dynamodb create-table --table-name Item --attribute-definitions AttributeName=ID,AttributeType=S --key-schema AttributeName=ID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint http://localhost:8000