const AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-west-1',
    endpoint: (process.env.DYNAMO_HOST) ? process.env.DYNAMO_HOST : null,
});

const dynamodb = new AWS.DynamoDB();

const ITEM_TABLE_NAME = 'Item';

const addRelated = url => new Promise((resolve, reject) => {
    const params = {
        TableName: ITEM_TABLE_NAME,
        Item: {
            url: {
                S: url,
            },
        },
        ExpressionAttributeNames: {
            '#url': 'url',
        },
        ConditionExpression: 'attribute_not_exists(#url)',
        ReturnConsumedCapacity: 'NONE',
        ReturnItemCollectionMetrics: 'NONE',
        ReturnValues: 'NONE',
    };
    dynamodb.putItem(params, (err) => {
        if (err) {
            if (err.code === 'ConditionalCheckFailedException') {
                resolve();
            } else {
                reject(err);
            }
        } else resolve();
    });
});

// addRelated('LAND-FOX-Vestidos-Chaleco-Camisetas-Camisas/dp/B07CBHWPJ5/');
// addRelated('tururu');
