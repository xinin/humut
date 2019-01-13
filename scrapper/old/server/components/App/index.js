let config;
let utils;

class App {
  static Config() {
    if (!config) config = require('./../Config');
    return config;
  }

  static Utils() {
    if (!utils) utils = require('./../Utils');
    return utils;
  }

  static launch() {
    return require('./servers');
  }
}

module.exports = App;
