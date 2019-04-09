const Item = require('./../../../components/Item');

exports.get = (req, res) => {
  const items = Item.getItems();
  const { lastKey } = req.query;
  console.log('lastKey', lastKey);
  let i = items.indexOf(lastKey) + 1;
  if (i >= items.length) i = 0;

  if (lastKey && i) {
    const next = items[i];
    res.status(200).send({ items: [next], lastKey: next });
  } else {
    res.status(200).send({ items: [items[0]], lastKey: items[0] });
  }
};

exports.post = (req, res) => {
  const { body } = req;
  console.log(body);
  res.status(202).send();
};
