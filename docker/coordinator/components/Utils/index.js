const uniqid = require('uniqid');

class Utils {
  static middlewareLog(req, _res, next) {
    let msg = `${req.method} ${req.path}`;
    if (Object.keys(req.query).length) {
      msg += ` ${JSON.stringify(req.query)}`;
    }
    if (Object.keys(req.body).length) {
      msg += ` ${JSON.stringify(req.body)}`;
    }
    console.log(msg);
    next();
  }

  static middleware(req, res, next) {
    if (req.headers && req.headers.uniqid) {
      req.uniqid = req.headers.uniqid;
    } else {
      req.uniqid = Utils.uniqid();
    }
    res.set({ uniqid: req.uniqid });

    next();
  }

  static uniqid() {
    return uniqid();
  }

  static response(_req, res, statusCode = 500, body) {
    let data = {};
    if (body && typeof body === 'string') {
      data = { msg: body };
    }

    if (statusCode >= 500) {
      data = { msg: 'Oops!, something was wrong.' };
    }

    res.status(statusCode).send(JSON.stringify(data));
  }
}

module.exports = Utils;
