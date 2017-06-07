var express = require('express');
var router = express.Router();

var index = require('../controllers/index');


/* GET home page. */
router.get('/', index.getMyFriends, index.GetMyGroups, index.GetMyChannels, function(req,res){

  /*
  var io = req.app.io;
  io.on('connection', function(socket){
      console.log('/////////////////////////////////////////////////');
      console.log('a user connected');
      console.log('/////////////////////////////////////////////////');
  });
  */
    res.render('home', {user: req.user, friends: req.friend, groups: req.groups, channels: req.channels});
});

module.exports = router;
