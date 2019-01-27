const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const PromiseBlue = require('bluebird');
// const uniqid = require('uniqid');

const fs = require('fs');
const { EOL } = require('os');

const concurrency = 1;

const FAILED = -1;
const WAITING = 0;
const RUNNING = 1;
const DONE = 2;

const AMAZON_URI = 'https://www.amazon.es/';

const uris = {

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

const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [],
);

const crawl = async ({ uri, stop }) => {
  console.log(`SCANNING ${uri}`);

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/67.0.3372.0 Safari/537.36');
  await page.setViewport({ height: 3000, width: 600 });

  try {
    await page.goto(`${AMAZON_URI}${uri}`);
  } catch (e) {
    console.log(`#EXCEPTION# ${uri}`);
    return crawl({ uri, stop });
  }
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 10));
  await page.waitFor(2000);

  const content = await page.content();

  const $ = cheerio.load(content);
  let bestseller = [];

  if (!uri.includes('pg=2') || !stop) {
    const nextCategories = [];

    const parent = $('span.zg_selected < li');

    //    console.log($.html($(parent).next('ul')));

    // En la ultima categoria el next no es un ul es un li, hay que cambiar esta parte
    if ($(parent).next('ul').is('ul')) {
      $(parent).next('ul').find('li > a').each((i, a) => {
        const href = cleanUri($(a).attr('href'));
        console.log(`ADD -> ${href}`);
        if (!uris[href]) {
          uris[href] = WAITING;
          nextCategories.push({ uri: href });
          // nextCategories.push({ uri: `${href}?pg=2`, stop: true });// dont continue, its second page
        }
      });
    } else {
      const href = `${uri}?pg=2`;
      if (!uris[href]) {
        uris[href] = WAITING;
        nextCategories.push({ uri: `${uri}?pg=2`, stop: true });// dont continue, its last level and second page
      }
    }

    if (nextCategories.length) {
      const subcategoryBestseller = await PromiseBlue.map(nextCategories, crawl, { concurrency });
      bestseller = [...bestseller, ...flatten(subcategoryBestseller)];
    }
  }

  console.log(`GET OBJECTS ${uri}`);
  $('#zg-ordered-list > li > span > div > span > a').each((i, a) => {
    bestseller.push(cleanUri($(a).attr('href')));
  });

  /* if ($(parent).index() === 0) {
     $(parent).nextAll('li').each((i, li) => {
       // console.log($.html(li));
       const href = cleanUri($(li).find('a').attr('href'));
       console.log(`ADD -> ${href}`);

       nextCategories.push({ uri: href, stop: true }); // dont continue, its last level
       nextCategories.push({ uri: `${href}?pg=2`, stop: true });// dont continue, its last level and second page
     });

     // console.log('aaa');

     // console.log($('span.zg_selected < li').index());
   } */


  // gp/bestsellers/electronics/934129031/

  /* if (nextCategories.length) {
    const subcategoryBestseller = await PromiseBlue.map(nextCategories, crawl, { concurrency });
    // console.log('subcategoryBestseller', JSON.stringify(subcategoryBestseller));
    bestseller = flatten(subcategoryBestseller);
  } */


  await browser.close();

  console.log(`SCANNED ${uri}`);
  if (bestseller.length > 0) {
    fs.appendFileSync('iterations.csv', `${bestseller.join(`,${EOL}`)},${EOL}`);
  }

  uris[uri] = DONE;

  return bestseller;
};

const save = (name, data) => {
  fs.writeFileSync(name, JSON.stringify(data));
};

const main = async () => {
  try {
    const ids = [
      { uri: 'gp/bestsellers/electronics/' },
      // { uri: 'gp/bestsellers/electronics/?pg=2' },

      // { uri: 'gp/bestsellers/electronics/970145031/' },


    ];

    /* const ids = [
      { uri: 'gp/bestsellers/electronics/970145031/' },
    ]; */

    const newItems = flatten(await PromiseBlue.map(ids, crawl, { concurrency }));

    // console.log(JSON.stringify(newItems));

    save('bestseller.json', newItems);
    return newItems;
  } catch (e) {
    console.log('EXCEPTION', e);
    throw e;
  }
};


main();
