const Crawler = require('crawler');

const FAILED = -1;
const WAITING = 0;
const RUNNING = 1;
const DONE = 2;

const pages = {
  'https://www.amazon.es/SUNLU-Filament-Dimensional-Accuracy-Printing/dp/B073PB9XWY': WAITING,
  'https://www.amazon.es/SUNLU-Filamento-impresi%C3%B3n-Exactitud-dimensional/dp/B078Q37SKB/ref=pd_sim_328_4/262-1906649-0843809?_encoding=UTF8&pd_rd_i=B078Q37SKB&pd_rd_r=00d275d0-1761-11e9-a0e9-b7cb03b28f63&pd_rd_w=XVxkQ&pd_rd_wg=PvGC7&pf_rd_p=cc1fdbc2-a24a-4df6-8bce-e68491d548ae&pf_rd_r=E5P5DY39TZFVVZH98AHP&psc=1&refRID=E5P5DY39TZFVVZH98AHP': WAITING
};

const example = 'https://www.amazon.es/dp/B075Q6NQJD/ref=sspa_dk_detail_3?psc=1&pd_rd_i=B075Q6NQJD&pd_rd_w=T8oWo&pf_rd_p=6d677afd-64cf-48fe-9556-faf126f8d23c&pd_rd_wg=PYKeq&pf_rd_r=8H1XJRM3YY90QKNSZS52&pd_rd_r=0f96e826-1763-11e9-97d0-359ec8b59b8f';

const crawler = new Crawler({
  maxConextions: 1,
  callback: (error, response, done) => {
    const uri = response.request.uri.href;
    const status = pages[uri];

    if (error || response.statusCode !== 200) {
      pages[uri] = FAILED;
      console.log('ERR', error);
    } else if (status === WAITING) {
      pages[uri] = RUNNING;
      const $ = response.$;
      const data = {};
      data.id = uri;
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
      $('#anonCarousel3 > ol > li').each((i, li) => {
        console.log('entramos');
        // console.log($(li2).find('div > a.a-link-normal').attr('href'));
      });

      if (pages[example] === undefined || pages[example] === null) {
        pages[example] = WAITING;
        crawler.queue(example);
      }
      pages[uri] = DONE;
      console.log(`SCANNED ${uri}`);
    }
    done();
  },
});

const test = () => {
  crawler.on('request', (options) => {
    console.log(`SCANNING ${options.uri}`);
  });

  crawler.on('drain', () => {
    console.log('DONE');
    console.log(pages);
  });

  crawler.queue(Object.keys(pages));
};


test();
