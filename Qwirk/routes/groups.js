var express = require('express');
var router  = express.Router();
<<<<<<< HEAD
var groups = require('../controllers/groups.js');

router.post('/add', function(req, res, next) {
  var result = groups.addGroup(req, res);
=======
var groupsController = require('../controllers/groupsController.js');

router.post('/add', function(req, res, next) {
  var result = groupsController.addGroup(req, res);
>>>>>>> a3e3c4f1502088d5d4680d36f213fb4c3797c5ad
  res.send();
});

module.exports = router;
