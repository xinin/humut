const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const AMAZON_URI = 'https://www.amazon.es/';

const cleanUri = (uri) => {
  let u = uri;
  u = u.replace(AMAZON_URI, '');
  if (u.startsWith('/')) {
    u = u.substr(1);
  }
  return u;
};

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setViewport({ height: 3000, width: 600 });

  await page.goto(`${AMAZON_URI}SUNLU-Filament-Dimensional-Accuracy-Printing/dp/B073PB9XWY`);
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitFor(1000);

  const content = await page.content();

  const $ = cheerio.load(content);
  const data = {};
  data.id = cleanUri(page.url());
  data.updated = Date.now();
  data.title = $('#productTitle').text().trim();
  data.keywords = $('head > meta[name=keywords]').attr('content').split(',');
  data.image = $('#landingImage').attr('data-old-hires');
  data.price = $('#priceblock_ourprice').text().replace('EUR ', '');
  data.rate = $('#acrPopover').attr('title').match(/[^\s]+/)[0];
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

  console.log(JSON.stringify(data));

  await browser.close();
})();


// anonCarousel3
