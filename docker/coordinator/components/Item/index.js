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

const updateItem = item => new Promise((resolve, reject) => {
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  let UpdateExpression = 'SET ';

  const marshalled = AWS.DynamoDB.Converter.marshall(item);
  delete marshalled.url;

  Object.keys(marshalled).forEach((prop) => {
    ExpressionAttributeNames[`#${prop.toUpperCase()}`] = prop;
    UpdateExpression += `#${prop.toUpperCase()} = :${prop.toLowerCase()}, `;
    ExpressionAttributeValues[`:${prop.toLowerCase()}`] = marshalled[prop];
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
  dynamodb.updateItem(params, (err) => {
    if (err) reject(err);
    else resolve();
  });
});

const clean = (item) => {
  const cleaned = item;
  Object.keys(cleaned).forEach((prop) => {
    if (!cleaned[prop]) {
      delete cleaned[prop];
    } else if (typeof cleaned[prop] === 'string' && cleaned[prop].length === 0) {
      delete cleaned[prop];
    } else if (Array.isArray(cleaned[prop]) && cleaned[prop].length === 0) {
      delete cleaned[prop];
    }
  });
  return cleaned;
};

const isValid = (item) => {
  // console.log(!item, !item.url, !item.url.length, !item.updated, !item.title, !item.title.length, !item.price);
  if (!item
    || !item.url || !item.url.length
    || !item.updated
    || !item.title || !item.title.length
    || !item.price) { return false; }
  return true;
};

module.exports = {
  getItems,
  updateItem,
  clean,
  isValid,
};
