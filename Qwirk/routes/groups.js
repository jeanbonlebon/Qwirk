var express = require('express');
var router  = express.Router();
var groups = require('../controllers/groups.js');

router.post('/add', function(req, res, next) {
  var result = groups.addGroup(req, res);
  res.send();
});

module.exports = router;
