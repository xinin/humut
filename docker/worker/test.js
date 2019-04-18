const _ = require('lodash');

const difference = (object, base) => {
  const changes = (object, base) => _.transform(object, (result, value, key) => {
    if (!_.isEqual(value, base[key])) {
      result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
    }
  });
  return changes(object, base);
};

const changes = (object, base) => _.transform(object, (result, value, key) => {
  const r = result;
  if (!_.isEqual(value, base[key])) {
    r[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
  }
});

const base = {
  uri: 'a/',
  keywords: ['a', 'b'],
  a: {
    a: 1,
  },
};

const son = {
  uri: 'a/',
  title: 'MI PERRO JUAN',
  updated: 123345354345,
  keywords: ['a', 'b', 'c'],
  a: {
    a: 1,
  },
};


console.log(difference(son, base));
console.log(changes(son, base));
