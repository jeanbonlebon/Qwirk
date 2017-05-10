var express = require('express');
var router  = express.Router();
var groupsController = require('../controllers/groupsController.js');

router.post('/add', function(req, res, next) {
  var result = groupsController.addGroup(req, res);
  res.send();
});

module.exports = router;
