const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const _ = require('lodash');

const { cleanUri, AMAZON_URI } = require('../utils');

const userAgents = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/67.0.3372.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:68.0) Gecko/20100101 Firefox/68.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko; Google Web Preview) Chrome/41.0.2272.118 Safari/537.36',
];

const crawl = uri => new Promise(async (resolve, reject) => {
  const data = {};
  try {
    const options = [];
    if (process.env.TOR_PROXY) {
      options.push('--proxy-server=http://proxy:8118');
    }
    const browser = await puppeteer.launch({ args: [...options, ...['--no-sandbox']] });
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on('request', (request) => {
      if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
        request.abort();
      } else {
        request.continue();
      }
    });

    page.on('response', (response) => {
      const request = response.request();
      const url = request.url();
      const status = response.status();

      if (url === AMAZON_URI + uri) {
        console.log('response url:', url, 'status:', status);
        if (status === 404) {
          data.error = 404;
          reject(data);
        }
      }
    });

    await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
    await page.setViewport({ height: 3000, width: 600 });

    await page.goto(`${AMAZON_URI}${uri}`);
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitFor(1000);

    const content = await page.content();
    const $ = cheerio.load(content);
    data.updated = Date.now();
    try {
      data.title = $('#productTitle').text().trim();
    } catch (e) {
      data.title = null;
    }
    try {
      data.keywords = $('head > meta[name=keywords]').attr('content').split(/[,|]/);
      data.keywords = _.compact(data.keywords);
      if (data.keywords.length === 0) data.keywords = null;
    } catch (e) {
      data.keywords = null;
    }
    try {
      data.image = $('#landingImage').attr('data-old-hires');
    } catch (e) {
      data.image = null;
    }
    try {
      // TODO hacer un buen cast a num
      let aux = $('#priceblock_ourprice').text().replace(/EUR|\$|£|\s/g, '').replace(/,/g, '.');
      aux = aux.split('-');
      [data.price] = aux;
      // data.pricehigher = (aux.length > 1) ? aux[1] : aux[0];
    } catch (e) {
      data.price = -1;
      // data.pricehigher = -1;
    }
    try {
      data.rate = ($('#acrPopover').attr('title')) ? $('#acrPopover').attr('title').match(/[^\s]+/)[0] : 0;
    } catch (e) {
      data.rate = null;
    }
    try {
      data.description = [];
      $('#featurebullets_feature_div > #feature-bullets > ul > li').each((_i, li) => {
        data.description.push($(li).text().trim());
      });
      data.description = _.compact(data.description);
      if (data.description.length === 0) data.description = null;
    } catch (e) {
      data.description = null;
    }

    try {
      data.details = {};
      $('#prodDetails > div.wrapper.ESlocale > div.column.col1 > div > div.content.pdClearfix > div > div > table > tbody > tr').each((i, tr) => {
        const label = $(tr).find('td.label').text().trim();
        const value = $(tr).find('td.value').text().trim();
        if (label && value) data.details[label] = value;
      });
    } catch (e) {
      data.details = null;
    }

    try {
      data.categories = [];
      $('#wayfinding-breadcrumbs_feature_div > ul > li:not(.a-breadcrumb-divider)').each((i, li) => {
        data.categories.push($(li).find('span > a').text().trim());
      });
      data.categories = _.compact(data.categories);
      if (data.categories.length === 0) data.categories = null;
    } catch (e) {
      data.categories = null;
    }

    try {
      data.related = [];
      $('#anonCarousel3 > ol > li').each((i, li) => {
        const href = $(li).find('div > a.a-link-normal').attr('href');
        if (!href.includes('picassoRedirect.html')) {
          data.related.push(cleanUri(href));
        }
      });
      data.related = _.compact(data.related);
      if (data.related.length === 0) data.related = null;
    } catch (e) {
      data.related = null;
    }

    await browser.close();
    resolve(data);
  } catch (e) {
    console.log('EXCEPTION', e);
    data.error = e;
    reject(data);
  }
});

module.exports = {
  crawl,
};
