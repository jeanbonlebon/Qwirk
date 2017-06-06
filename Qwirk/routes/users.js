var express = require('express');
var router = express.Router();

var usr = require('../controllers/users.js');
var index = require('../controllers/index');

console.log(router.io);
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/:username',index.getMyFriends, index.GetMyGroups, index.GetMyChannels, function(req, res) {


    var io = req.app.io;
    io.on('connection', function(socket){
      socket.on('84585', function(msg, user){
          console.log(socket.id);

          console.log(user);
          console.log('message: ' + msg);

          //io.emit('84585', msg);
          socket.broadcast.emit('84585', msg);
      });
    });


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

/*
io.on('connection', function(socket){
  socket.on('84585', function(msg, user){
      console.log(socket.id);

      console.log(user);
      console.log('message: ' + msg);

      //io.emit('84585', msg);
      socket.broadcast.emit('84585', msg);
  });
});
*/


module.exports = router;

/*
module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('message', function(message) {
            logger.log('info',message.value);
            socket.emit('ditConsumer',message.value);
            console.log('from console',message.value);
        });
    });
};
*/
