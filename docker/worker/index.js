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

    const infoToUpdate = { // We need the item ID (url)
      url: item.url,
    };

    if (itemUpdated.price) {
      infoToUpdate.iteration = (item.iteration) ? item.iteration + 1 : 1;
      infoToUpdate.average = (item.average) ? item.average + ((itemUpdated.price - item.average) / infoToUpdate.iteration) : itemUpdated.price;
      infoToUpdate.average = Math.round(infoToUpdate.average * 100) / 100;
      infoToUpdate.price = itemUpdated.price; // price always have to exists
    }

    const differences = Object.keys(diff(itemUpdated, item));
    differences.forEach((key) => {
      infoToUpdate[key] = itemUpdated[key];
    });

    return infoToUpdate;
  } catch (e) {
    console.log(`ERR on ${JSON.stringify(item)}`);
    if (e.error === 404) {
      return { ...item, ...{ unavailable: true } };
    }
    return e;
  }
};

const execute = lastKey => new Promise(async (resolve, reject) => {
  try {
    const { items, lastKey: LK } = await getItems(lastKey);
    const crawled = await PromiseBlue.map(items, aux, { concurrency });
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
