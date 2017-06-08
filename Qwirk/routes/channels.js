var express = require('express');
var router  = express.Router();
var channels = require('../controllers/channels.js');
var index = require('../controllers/index');

router.post('/add', function(req, res, next) {

    channels.addChannel(req, res).then(function(results){
        if(results){
            return res.json({status : 300, channel: results});
        }else{
            return res.json({status : 404});
        }
    });

});

router.post('/joinChannel', function(req, res){

    channels.joinChannel(req, res).then(function(result){
        if(result){
            return res.json({success : "Updated Successfully", status : 200});
        }else{
            return res.json({success : "Failure", status : 404});
        }
    })

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

router.get('/kick/:name', function(req, res) {

    channels.kickMember(req, res).then(function(results){
        if(results){
            return res.json({status : 300});
        }else{
            return res.json({status : 404});
        }
    });

});

router.get('/del/:name', function(req, res) {

      channels.delChannel(req, res).then(function(results){
          if(results){
              return res.json({status : 300});
          }else{
              return res.json({status : 404});
          }
      });
});


router.get(/^(.*)$/, function(req, res){
    channels.getChannelsList(req, res);
    return res;
});

module.exports = router;
