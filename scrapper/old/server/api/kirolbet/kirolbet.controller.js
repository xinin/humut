const App = require('./../../components/App');

const Utils = App.Utils();

const Crawler = require('crawler');

exports.test = (req, res) => {
  const pages = [{
    uri: 'https://larioja.kirolbet.es/'
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
    Utils.response(req, res, 200, data);
  };

  const crawler = new Crawler({
    maxConextions: 2,
    callback: (error, response, done) => {
      const uri = response.request.uri.href;
      if (error || response.statusCode !== 200) {
        // TODO hacer algo con esto
        console.log('ERR', error);
        pages[pages.findIndex((page => page.uri === uri))].done = true;
      } else {
        const $ = response.$;
        $('#EveTop > ul.apuestas > li').each((i, match) => {
          const m = {};
          $.load(match);
          m.match = $('.apuestas_fut').attr('des');
          m.bet = {};
          m.bet['1'] = $('.apuestas_fut > ul > li > a[title="1"] > p > span.coef').html();
          m.bet.x = $('.apuestas_fut > ul > li > a[title="X"] > p > span.coef').html();
          m.bet['2'] = $('.apuestas_fut > ul > li > a[title="2"] > p > span.coef').html();
          result.push(m);
        });
        pages[pages.findIndex((page => page.uri === uri))].done = true;
        if (checkPages()) {
          cb(result);
        }
      }
      done();
    }
  });

  pages.forEach((page) => {
    crawler.queue(page.uri);
  });
};
