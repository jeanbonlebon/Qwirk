var express = require('express');
var router = express.Router();

var usr = require('../controllers/users.js');
var index = require('../controllers/index');


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/:username',index.getMyFriends, index.GetMyGroups, index.GetMyChannels, function(req, res) {

    /*
    console.log('////////////////////////////////////////////////');
    console.log(req.app.io);
    console.log('////////////////////////////////////////////////');
    var io = req.app.io;

      socket.on('84585', function(msg, user){
          console.log(socket.id);

          console.log(user);
          console.log('message: ' + msg);

          io.emit('84585', msg);
          //socket.broadcast.emit('84585', msg);
      });
    */
    
    usr.GetAUser(req, res).then(function(results){
        if(results){
            //return res.jqXHR({status : 404});
            //return res.json({selectedUser: res.selectedUser});
            res.render('friend', {
              selectedUser: res.selectedUser,
              user: req.user,
              friends: req.friend,
              groups: req.groups,
              channels: req.channels
            });
        }else{
            res.render('home', {
              friends: req.friend,
              groups: req.groups,
              channels: req.channels
            });
        }
    });

});

module.exports = router;
