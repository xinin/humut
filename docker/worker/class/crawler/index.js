const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const { cleanUri, AMAZON_URI } = require('../utils');

const crawl = async (uri) => {
  const data = { id: uri };

  try {
    console.log(`SCANNING ${uri}`);

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

    const page = await browser.newPage();

    page.on('response', (response) => {
      const request = response.request();
      const url = request.url();
      const status = response.status();
      if (url === AMAZON_URI + uri && status === 404) {
        console.log('response url:', url, 'status:', status);
      }
    });

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/67.0.3372.0 Safari/537.36');
    await page.setViewport({ height: 3000, width: 600 });

    await page.goto(`${AMAZON_URI}${uri}`);
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitFor(1000);

    const content = await page.content();
    const $ = cheerio.load(content);
    // data.id = cleanUri(page.url());
    data.updated = Date.now();
    data.title = $('#productTitle').text().trim();
    try {
      data.keywords = $('head > meta[name=keywords]').attr('content').split(',');
    } catch (e) {
      data.keywords = [];
    }
    data.image = $('#landingImage').attr('data-old-hires');
    data.price = $('#priceblock_ourprice').text().replace('EUR ', '');
    data.rate = ($('#acrPopover').attr('title')) ? $('#acrPopover').attr('title').match(/[^\s]+/)[0] : 0;
    data.description = [];
    $('#featurebullets_feature_div > #feature-bullets > ul > li').each((i, li) => {
      data.description.push($(li).text().trim());
    });
    data.details = {};
    $('#prodDetails > div.wrapper.ESlocale > div.column.col1 > div > div.content.pdClearfix > div > div > table > tbody > tr').each((i, tr) => {
      const label = $(tr).find('td.label').text().trim();
      const value = $(tr).find('td.value').text().trim();
      if (label && value) data.details[label] = value;
    });
    data.categories = [];
    $('#wayfinding-breadcrumbs_feature_div > ul > li:not(.a-breadcrumb-divider)').each((i, li) => {
      data.categories.push($(li).find('span > a').text().trim());
    });
    data.related = [];
    $('#anonCarousel3 > ol > li').each((i, li) => {
      const href = $(li).find('div > a.a-link-normal').attr('href');
      data.related.push(cleanUri(href));
    });
    await browser.close();
    return data;
  } catch (e) {
    console.log('EXCEPTION', e);
    return data;
  }
};

module.exports = {
  crawl,
};
