var express = require('express');
var router = express.Router();

var index = require('../controllers/index');

/* GET home page. */
router.get('/', index.getMyFriends, index.GetMyGroups, index.GetMyChannels, index.GetHome);


module.exports = router;
