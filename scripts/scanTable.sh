tableName=$1
aws dynamodb scan --table-name Item --endpoint http://localhost:8000 --output table --query Items