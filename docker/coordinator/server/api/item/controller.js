const Item = require('./../../../components/Item');

exports.getItems = async (req, res) => {
  const { segment } = req.query;
  let { lastKey } = req.query;
  if (lastKey && lastKey.length) {
    lastKey = JSON.parse(Buffer.from(lastKey, 'base64').toString('ascii'));
  }else{
    lastKey = null;
  }
  // console.log('lastKey', lastKey, 'segment', segment);
  try {
    const items = await Item.getItems({ lastKey, segment });
    res.status(200).send(items);
  } catch (e) {
    console.log('e', e);
    res.status(500);
  }
};

exports.createItems = (req, res) => {
  const { body:items } = req;
  
  //console.log(body);
  res.status(202).send();
};
