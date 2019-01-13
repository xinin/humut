const App = require('./../../components/App');

const Utils = App.Utils();

exports.test = (req, res) => {
  Utils.response(req, res, 200, 'Hello World!');
};
