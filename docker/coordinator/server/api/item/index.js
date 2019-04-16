const express = require('express');
const controller = require('./controller.js');

const router = express.Router();

router.get('/', controller.getItems);

router.post('/', controller.createItems);

module.exports = router;
