const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-1' });

const last = {
  0: null,
  1: null,
  2: null,
  3: null,
};

const dynamodb = new AWS.DynamoDB();

const TotalSegments = 4;

const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const scan = ({ Segment }) => new Promise((resolve, reject) => {
  const params = {
    TableName: 'CloudWatchParameterStatic',
    Limit: 5,
    Segment,
    TotalSegments,
    ExclusiveStartKey: last[Segment],
  };
  dynamodb.scan(params, async (err, data) => {
    if (err) reject(err); // an error occurred
    else {
      last[Segment] = data.LastEvaluatedKey;
      if (data.Count > 0) {
        const items = [];
        data.Items.forEach((item) => {
          const unmarshalled = AWS.DynamoDB.Converter.unmarshall(item);
          items.push(unmarshalled.AlarmName);
        });
        if (!data.LastEvaluatedKey) resolve(items);
        else { resolve([...items, ...await scan({ Segment })]); }
      } else resolve([]);
    }
  });
});

const main = async () => {
  const data = await Promise.all([
    scan({ Segment: 0 }),
    scan({ Segment: 1 }),
    scan({ Segment: 2 }),
    scan({ Segment: 3 }),
  ]);
  console.log(flatten(data));
};

main();
