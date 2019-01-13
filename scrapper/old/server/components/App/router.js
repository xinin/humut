
class Router {
  static routes(app) {
    app.use('/hello', require('./../../api/hello'));
    app.use('/kirolbet', require('./../../api/kirolbet'));

    app.use((req, res) => {
      res.status(404).send('Not Found');
    });
  }
}

module.exports = Router;
