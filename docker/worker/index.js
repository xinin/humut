const PromiseBlue = require('bluebird');
const { crawl } = require('./class/crawler');
const {
  getItems, pushItems, loadConfig, diff,
} = require('./class/utils');

loadConfig(require('./config.json'));

const concurrency = 1;

const aux = async (item) => {
  try {
    console.log(`CRAWLED ${item.url}`);
    const itemUpdated = await crawl(item.url);
    const differences = Object.keys(diff(itemUpdated, item));
    const infoToUpdate = { // We need the item ID (url)
      url: item.url,
    };
    differences.forEach((key) => {
      infoToUpdate[key] = itemUpdated[key];
    });
    infoToUpdate.price = itemUpdated.price; // Price is mandatory

    return infoToUpdate;
  } catch (e) {
    console.log(`ERR on ${item}`);
    return e;
  }
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


const wait = time => new Promise((resolve) => {
  console.log('WAITING');
  setTimeout(() => resolve(), time);
});

const start = async () => {
  let lastKey = null;
  while (true) {
    console.log(`----- ${lastKey} -----`);
    lastKey = await execute(lastKey);
    await wait(5000);
    console.log('-------------');
  }
};

start();
