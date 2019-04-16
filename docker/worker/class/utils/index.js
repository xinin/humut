const request = require('request');

const AMAZON_URI = 'https://www.amazon.es/';

const loadConfig = (c) => {
  const conf = c;
  if (process.env.COORDINATOR_HOST) conf.coordinator.uri = process.env.COORDINATOR_HOST;
  if (process.env.WORKER_NUM) conf.worker.num = process.env.WORKER_NUM;

  process.env.config = JSON.stringify(conf);
  return conf;
};

const cleanUri = (uri) => {
  let u = uri;
  u = u.replace(AMAZON_URI, '');
  if (u.startsWith('/')) {
    u = u.substr(1);
  }

  let i = u.indexOf('?');
  if (i > 0) u = u.substring(0, i);
  i = u.indexOf('ref=');
  if (i > 0) u = u.substring(0, u.indexOf('ref='));

  return u;
};

const getItems = lastKey => new Promise((resolve, reject) => {
  const COORDINATOR_URI = JSON.parse(process.env.config).coordinator.uri;
  const SEGMENT = JSON.parse(process.env.config).worker.num;

  const options = {
    url: `${COORDINATOR_URI}/item`,
    qs: { lastKey, segment: SEGMENT },
  };
  // console.log(options);
  try {
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        console.log('ERROR Request getItems', error);
        reject(error);
      }
    });
  } catch (e) {
    reject(e);
  }
});

const pushItems = items => new Promise((resolve, reject) => {
  const COORDINATOR_URI = JSON.parse(process.env.config).coordinator.uri;

  const options = {
    url: `${COORDINATOR_URI}/item`,
    method: 'POST',
    body: items,
    json: true,
  };

  try {
    request(options, (error, response) => {
      if (!error && response.statusCode === 202) {
        resolve();
      } else {
        console.log('ERROR Request pushItems', error);
        reject(error);
      }
    });
  } catch (e) {
    reject(e);
  }
});

module.exports = {
  AMAZON_URI,
  cleanUri,
  getItems,
  pushItems,
  loadConfig,
};
