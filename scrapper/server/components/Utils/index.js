const uniqid = require('uniqid');

class Utils {
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

  static response(req, res, statusCode, body) {
    statusCode = statusCode || 500;

    if (body && typeof body === 'string') {
      body = { msg: body };
    }

    if (statusCode >= 500) {
      body = { msg: 'Oops!, something was wrong.' };
    }

    body = JSON.stringify(body);

    res.status(statusCode || 500).send(body);
  }
}

module.exports = Utils;

