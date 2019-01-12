

const express = require('express');
const controller = require('./kirolbet.controller');

const router = express.Router();

router.get('/', controller.test);


module.exports = router;
