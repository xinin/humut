

const EventEmitter = require('events');

// const App = require('./index');
// const DB = App.DB();
const util = require('util');

// Cargas iniciales y dependencias
const Setup = function setup() {
  EventEmitter.call(this);

  // const promises = [DB.mongoConnect()];

  const promises = [];

  Promise.all(promises).then(
    () => this.emit('success', null),
    err => this.emit('error', err)
  );
};

util.inherits(Setup, EventEmitter);

module.exports = new Setup();
