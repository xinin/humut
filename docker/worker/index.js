const PromiseBlue = require('bluebird');

// TODO Mirar esta parte y ordenarla
const loadConfig = (c) => {
  const conf = c;
  if (process.env.COORDINATOR_HOST) conf.coordinator.uri = process.env.COORDINATOR_HOST;
  process.env.config = JSON.stringify(conf);
  return conf;
};

loadConfig(require('./config.json'));

const { crawl } = require('./class/crawler');
const { getItems, pushItems } = require('./class/utils');

const concurrency = 1;

const execute = lastKey => new Promise(async (resolve, reject) => {
  try {
    // console.log('getItems', lastKey);
    const { items, lastKey: LK } = await getItems(lastKey);
    console.log('items', items, 'LK', lastKey);
    const crawled = await PromiseBlue.map(items, crawl, { concurrency });
    console.log(crawled);
    await pushItems(crawled);
    resolve(LK);
  } catch (e) {
    // TODO
    console.log('EXCEPTION', e);
    reject(lastKey);
  }
});


const start = async () => {
  let lastKey;
  while (true) {
    console.log(`----- ${lastKey} -----`);
    lastKey = await execute(lastKey);
    console.log('-------------');
  }
};

start();
