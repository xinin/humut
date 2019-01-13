

const _ = require('lodash');

const Config = {
  app: {
    port: 9000,
    ip: '0.0.0.0',
    maxWorkerCrashes: 5
  }
};

let custom = {};
try {
  custom = require('./custom.js'); // Ponerlo en la ruta del servidor cuando llegue el momento
} catch (e) {
  console.log('Custom config file not exits');
}

module.exports = _.merge(
  Config,
  custom || {}
);
