const request = require('request');

const AMAZON_URI = 'https://www.amazon.es/';
const COORDINATOR_URI = 'http://localhost:9000';

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
  const options = {
    url: (lastKey) ? `${COORDINATOR_URI}/?lastKey=${lastKey}` : `${COORDINATOR_URI}/`,
  };
  console.log(options);
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
  const options = {
    url: `${COORDINATOR_URI}/`,
    method: 'POST',
    body: JSON.stringify(items),
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
};
