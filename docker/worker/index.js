
const PromiseBlue = require('bluebird');
const { crawl } = require('./class/crawler');
const { getItems, pushItems, loadConfig } = require('./class/utils');

loadConfig(require('./config.json'));

const concurrency = 1;

const aux = async (item) => {
  let data;
  try {
    data = await crawl(item);
  } catch (e) {
    console.log(`ERR on ${item}`);
    data = e;
  }
  return data;
};

const execute = lastKey => new Promise(async (resolve, reject) => {
  try {
    // console.log('getItems', lastKey);
    const { items, lastKey: LK } = await getItems(lastKey);
    // console.log('items', items, 'LK', lastKey);
    const crawled = await PromiseBlue.map(items, aux, { concurrency });
    // console.log(crawled);
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
