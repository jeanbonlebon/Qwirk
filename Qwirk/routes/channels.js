var express = require('express');
var router  = express.Router();
<<<<<<< HEAD
var channels = require('../controllers/channels.js');

router.post('/add', function(req, res, next) {
  var result = channels.addChannel(req, res);
  res.send();
});

module.exports = router;
=======
var channelsController = require('../controllers/channelsController.js');

router.post('/add', function(req, res, next) {
  var result = channelsController.addChannel(req, res);
  console.log('test');
  res.send();
});

module.exports = router;
>>>>>>> a3e3c4f1502088d5d4680d36f213fb4c3797c5ad
