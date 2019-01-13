const Crawler = require('crawler');

const test = (req, res) => {
  const pages = [{
    uri: 'https://www.amazon.es/SUNLU-Filament-Dimensional-Accuracy-Printing/dp/B073PB9XWY',
  }];
  const result = [];

  // TODO esta funcion a servicio de crawling
  const checkPages = () => {
    for (let i = 0; i < pages.length; i += 1) {
      if (!pages[i].done) return false;
    }
    return true;
  };
  // TODO Crear servicio de crawler para pasar solo parametros y servicio por web que tenga un cb qe se le pase con el crawling por web

  const cb = (data) => {
    console.log('CB')
    console.log(data);
  };

  const crawler = new Crawler({
    maxConextions: 1,
    callback: (error, response, done) => {
      const uri = response.request.uri.href;
      if (error || response.statusCode !== 200) {
        // TODO hacer algo con esto
        console.log('ERR', error);
        pages[pages.findIndex((page => page.uri === uri))].done = true;
      } else {
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
        })
        data.details = {};
        $('#prodDetails > div.wrapper.ESlocale > div.column.col1 > div > div.content.pdClearfix > div > div > table > tbody > tr').each((i, tr) => {
          const label = $(tr).find('td.label').text().trim();
          const value = $(tr).find('td.value').text().trim();
          if (label && value) data.details[label] = value;
        });
        data.categories = [];
        $('#wayfinding-breadcrumbs_feature_div > ul > li:not(.a-breadcrumb-divider)').each((i, li) => {
          data.categories.push($(li).find('span > a').text().trim())
        });
        console.log(data)
        pages[pages.findIndex((page => page.uri === uri))].done = true;
        if (checkPages()) {
          cb(result);
        }
      }
      done();
    },
  });

  pages.forEach((page) => {
    crawler.queue(page.uri);
  });
};


test();
