var express = require('express');
var router = express.Router();

var usr = require('../controllers/users.js');
var index = require('../controllers/index');

/*
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
*/

router.get('/:username',index.getMyFriends, index.GetMyGroups, index.GetMyChannels, function(req, res) {

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

router.get(/^(.*)$/, function(req, res){
    usr.getUserList(req, res);
    return res;
});

module.exports = router;
