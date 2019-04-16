const AWS = require('aws-sdk');

AWS.config.update({
  region: 'eu-west-1',
  endpoint: (process.env.DYNAMO_HOST) ? process.env.DYNAMO_HOST : null,
});

const dynamodb = new AWS.DynamoDB();

const ITEM_TABLE_NAME = 'Item';
const PRICE_TABLE_NAME = 'Price';
const LIMIT = 1;
const TOTAL_SEGMENTS = 2;


const getItems = ({ segment, lastKey }) => new Promise((resolve, reject) => {
  const params = {
    TableName: ITEM_TABLE_NAME,
    Limit: LIMIT,
    Segment: segment,
    TotalSegments: TOTAL_SEGMENTS,
    ExclusiveStartKey: lastKey,
  };
  console.log(params);
  dynamodb.scan(params, (err, data) => {
    if (err) reject(err);
    else if (data.Count > 0) {
      const payload = {
        items: [],
        lastKey: (data.LastEvaluatedKey) ? Buffer.from(JSON.stringify(data.LastEvaluatedKey)).toString('base64') : null,
      };
      data.Items.forEach((item) => {
        const unmarshalled = AWS.DynamoDB.Converter.unmarshall(item);
        payload.items.push(unmarshalled);
      });
      resolve(payload);
    } else resolve({ items: [], lastKey: null });
  });
});

const updateItem = (item) => {
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  let UpdateExpression = 'SET ';

  Object.keys(item).forEach((prop) => {
    if (typeof item.prop === 'string') {
      ExpressionAttributeNames[`#${prop.toUpperCase()}`] = prop;
      ExpressionAttributeValues[`:${prop.toLowerCase()}`] = { S: item.prop };
      UpdateExpression += `#${prop.toUpperCase()} = :${prop.toLowerCase()}, `;
    } else if (typeof item.prop === 'number') {
      // TODO
    }
    // TODO others types
  });

  UpdateExpression = UpdateExpression.substring(0, UpdateExpression.length - 2);

  const params = {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    Key: {
      url: {
        S: item.url,
      },
    },
    ReturnConsumedCapacity: 'NONE',
    ReturnItemCollectionMetrics: 'NONE',
    ReturnValues: 'NONE',
    TableName: ITEM_TABLE_NAME,
    UpdateExpression,
  };
  dynamodb.updateItem(params, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); //
  });
};

module.exports = {
  getItems,
  updateItem,
};
