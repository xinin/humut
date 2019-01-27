const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

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


const items = [
  'kwmobile-Enchufe-Adaptador-UK-EU-Adaptadores/dp/B07GS6H4MK/',
  'LAND-FOX-Vestidos-Chaleco-Camisetas-Camisas/dp/B07CBHWPJ5/',
  'POLP-Beb%C3%A9-Monos-Vaqueros-Fotografia/dp/B07H1DYSTK/',
  'Enchufe-Inteligente-OxaOxe-Control-Temporizador/dp/B07KP7CXZ3/',
  'Hama-108884-Adaptador-enchufe-el%C3%A9ctrico/dp/B00EJLTNAY/',
];

app.get('/', (req, res) => {
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
});

app.post('/', (req, res) => {
  const { body } = req;
  console.log(body);
  res.status(202).send();
});

app.listen(9000, () => {
  console.log('Coordinator on port 9000!');
});
