const AWS = require('aws-sdk');

AWS.config.update({
  region: 'eu-west-1',
  endpoint: (process.env.DYNAMO_HOST) ? process.env.DYNAMO_HOST : null,
});

const dynamodb = new AWS.DynamoDB();

const ITEM_TABLE_NAME = 'Item';
const LIMIT = 5;
const TOTAL_SEGMENTS = 2;

const test = () => new Promise((resolve, reject) => {
  dynamodb.listTables({}, (err, data) => {
    if (err) {
      console.log(err, err.stack); reject(err);
    } else { console.log(data); resolve(data); } // successful response
  });
});

/* const getItems = () => {
  // TODO query to DynamoDB
  const items = [
    'kwmobile-Enchufe-Adaptador-UK-EU-Adaptadores/dp/B07GS6H4MK/',
    'LAND-FOX-Vestidos-Chaleco-Camisetas-Camisas/dp/B07CBHWPJ5/',
    'POLP-Beb%C3%A9-Monos-Vaqueros-Fotografia/dp/B07H1DYSTK/',
    'Enchufe-Inteligente-OxaOxe-Control-Temporizador/dp/B07KP7CXZ3/',
    'Hama-108884-Adaptador-enchufe-el%C3%A9ctrico/dp/B00EJLTNAY/',
  ];
  return items;
}; */

const getItems = ({ Segment, LastKey }) => new Promise((resolve, reject) => {
  const params = {
    TableName: ITEM_TABLE_NAME,
    Limit: LIMIT,
    Segment,
    TotalSegments: TOTAL_SEGMENTS,
    ExclusiveStartKey: LastKey,
  };
  dynamodb.scan(params, (err, data) => {
    if (err) reject(err);
    else if (data.Count > 0) {
      const payload = {
        items: [],
        lastKey: data.LastEvaluatedKey,
      };
      data.Items.forEach((item) => {
        const unmarshalled = AWS.DynamoDB.Converter.unmarshall(item);
        payload.items.push(unmarshalled);
      });
    } else resolve({ items: [], lastKey: null });
  });
});

const updateItem = () => {

};

module.exports = {
  getItems,
  updateItem,
  test,
};
