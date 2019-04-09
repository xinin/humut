const itemRoutes = require('./../../server/api/item');

class Router {
  static routes(app) {
    app.use('/item', itemRoutes);

    app.get('/status', (_req, res) => {
      res.status(202).send();
    });

    app.use((_req, res) => {
      res.status(404).send('Not Found');
    });
  }
}

module.exports = Router;
