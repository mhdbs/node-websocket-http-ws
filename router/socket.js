'use strict';

var express = require('express');

var router = express.Router();

var socketerequest = require('../controller/request');

router.post('/broadcast', socketerequest.requestPayload);

module.exports = router;
