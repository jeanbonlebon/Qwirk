var express = require('express');
var router = express.Router();

var index = require('../controllers/index');


/* GET home page. */
router.get('/', index.getMyFriends, index.GetMyGroups, index.GetMyChannels, function(req,res){
    res.render('home', {user: req.user, friends: req.friend, groups: req.groups, channels: req.channels});
});

router.get('/profil', index.getMyFriends, index.GetMyGroups, index.GetMyChannels, function(req,res){
    res.render('profile', {user: req.user, friends: req.friend, groups: req.groups, channels: req.channels});
});

module.exports = router;
