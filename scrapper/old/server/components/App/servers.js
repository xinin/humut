

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const setup = require('./setup');
const router = require('./router');
const App = require('./index');

const Config = App.Config();
const Utils = App.Utils();

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
app.use(bodyParser.json({ limit: '10mb' }));
app.use(methodOverride());
app.use(cookieParser());
app.use(Utils.middleware);
app.use((req, res, next) => {
  let msg = `${req.method} ${req.path}`;
  if (Object.keys(req.query).length) {
    msg += ` ${JSON.stringify(req.query)}`;
  }
  if (Object.keys(req.body).length) {
    msg += ` ${JSON.stringify(req.body)}`;
  }
  console.log(msg);
  next();
});

setup.once('success', () => {
  // Multithread
  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i += 1) {
      cluster.fork();
    }

    let maxWorkerCrashes = Config.app.maxWorkerCrashes;
    cluster.on('exit', (worker) => {
      App.log().info(false, `worker ${worker.process.pid} died`);
      if (worker.suicide !== true) {
        maxWorkerCrashes += 1;
        if (maxWorkerCrashes <= 0) {
          console.log({ msg: 'Too many worker crashes -> process exit', code: 500, alert: 'system' });
        } else {
          cluster.fork();
        }
      }
    });
  } else {
    try {
      router.routes(app);
      const server = require('http').createServer(app);
      server.listen(Config.app.port, Config.app.ip, () => {
        console.log(`API server listening on ${Config.app.ip}:${Config.app.port}`);
      });
    } catch (err) {
      console.log({ msg: `Error creating the server: ${err.stack || JSON.stringify(err)}`, code: 500, alert: 'system' });
    }
  }
}).on('error', (err) => {
  console.log({ msg: `Server Setup Error: ${JSON.stringify(err)}`, code: 500, alert: 'system' });
});

process.on('uncaughtException', (err) => {
  console.log('Excepción: ', err);
});

process.on('unhandledRejection', (err) => {
  console.log('UnhandledRejection: ', err);
});

module.exports = app;
