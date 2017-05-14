var express = require('express');
var router  = express.Router();
var channels = require('../controllers/channels.js');

router.post('/add', function(req, res, next) {
  var result = channels.addChannel(req, res);
  res.send();
});

module.exports = router;
