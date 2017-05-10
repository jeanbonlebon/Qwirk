var express = require('express');
var router  = express.Router();
var channelsController = require('../controllers/channelsController.js');

router.post('/add', function(req, res, next) {
  var result = channelsController.addChannel(req, res);
  console.log('test');
  res.send();
});

module.exports = router;