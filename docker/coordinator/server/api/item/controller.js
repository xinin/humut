const Item = require('./../../../components/Item');

exports.getItems = async (req, res) => {
  const { segment } = req.query;
  let { lastKey } = req.query;
  if (lastKey && lastKey.length) {
    lastKey = JSON.parse(Buffer.from(lastKey, 'base64').toString('ascii'));
  } else {
    lastKey = null;
  }
  // console.log('lastKey', lastKey, 'segment', segment);
  try {
    const items = await Item.getItems({ lastKey, segment });
    res.status(200).send(items);
  } catch (e) {
    // TODO
    console.log('e', e);
    res.status(500);
  }
};


const wait = time => new Promise((resolve) => {
  setTimeout(() => resolve, time);
});

exports.createItems = async (req, res) => {
  const { body: items } = req;

  const promises = [];

  items.forEach(async (item) => {
    const cleaned = Item.clean(item);
    if (Item.isValid(cleaned)) {
      console.log(cleaned);
      promises.push(Item.updateItem(item));
    }
    await wait(1000);
  });

  try {
    await Promise.all(promises);
    res.status(202).send();
  } catch (e) {
    // TODO
    console.log(e);
    res.status(500);
  }
};
