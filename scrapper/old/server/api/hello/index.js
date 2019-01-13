

const express = require('express');
const controller = require('./hello.controller');

const router = express.Router();

router.get('/', controller.test);


module.exports = router;
