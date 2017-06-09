var express = require('express');
var router  = express.Router();
var channels = require('../controllers/channels.js');
var index = require('../controllers/index');

router.post('/add', function(req, res, next) {
    var result = channels.addChannel(req, res);
    res.send();
});

router.get('/:name', index.getMyFriends, index.GetMyGroups, index.GetMyChannels, function(req, res, next) {

    channels.getChannel(req, res).then(function(results){
        if(results){
            //return res.jqXHR({status : 404});
            //return res.json({selectedUser: res.selectedUser});
            res.render('channel', {
              selectedChannel: res.selectedChannel,
              selectedChannelUsers : res.selectedChannelUsers,
              user: req.user,
              myself: req.user.username,
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

router.get(/^(.*)$/, function(req, res){
    channels.getChannelsList(req, res);
    return res;
});

module.exports = router;
