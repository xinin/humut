const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const PromiseBlue = require('bluebird');

const concurrency = 1;

const fs = require('fs');
const uniqid = require('uniqid');

const FAILED = -1;
const WAITING = 0;
const RUNNING = 1;
const DONE = 2;

const pages = {
  'gp/bestsellers/electronics/937994031': WAITING,
  'gp/bestsellers/electronics/937994031?pg=2': WAITING,
};

const AMAZON_URI = 'https://www.amazon.es/';

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

const crawl = async (uri) => {
  console.log(`SCANNING ${uri}`);

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/67.0.3372.0 Safari/537.36');
  await page.setViewport({ height: 3000, width: 600 });

  await page.goto(`${AMAZON_URI}${uri}`);
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 10));
  await page.waitFor(2000);

  const content = await page.content();

  const $ = cheerio.load(content);
  const items = [];
  $('#zg-ordered-list > li > span > div > span > a').each((i, a) => {
    items.push(cleanUri($(a).attr('href')));
  });

  await browser.close();

  console.log(`SCANNED ${uri}`);

  return items;
};

const save = (name, data) => {
  fs.writeFileSync(name, JSON.stringify(data));
};

const main = async () => {
  try {
    const ids = [];

    Object.keys(pages).forEach((key) => {
      ids.push(key);
    });

    const newItems = await PromiseBlue.map(ids, crawl, { concurrency });

    console.log(JSON.stringify(newItems));

    save('bestseller.json', newItems);
    return newItems;
  } catch (e) {
    console.log('EXCEPTION', e);
    throw e;
  }
};


main();
