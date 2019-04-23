const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const Router = require('./../components/Router');
const Utils = require('./../components/Utils');

const app = express();
app.use(helmet.hidePoweredBy({ setTo: 'PHP 5.3.0' })); // hidePoweredBy to remove the X-Powered-By header
app.use(helmet.hsts({ maxAge: 7776000000 })); // hsts for HTTP Strict Transport Security
app.use(helmet.ieNoOpen()); // ieNoOpen sets X-Download-Options for IE8+
app.use(helmet.noCache()); // noCache to disable client-side caching
app.use(helmet.noSniff()); // noSniff to keep clients from sniffing the MIME type
app.use(helmet.frameguard()); // frameguard to prevent clickjacking
app.use(helmet.xssFilter()); // xssFilter adds some small XSS protections
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(methodOverride());
app.use(cookieParser());
app.use(Utils.middleware);
app.use(Utils.middlewareLog);
Router.routes(app);

// TODO multiple workers
app.listen(9000, () => {
  console.log('Coordinator ready on port 9000!');
});
