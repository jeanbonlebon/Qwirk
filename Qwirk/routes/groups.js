var express = require('express');
var router  = express.Router();
var groups = require('../controllers/groups.js');
var index = require('../controllers/index');

router.post('/add', function(req, res, next) {

    groups.addGroup(req, res).then(function(results){
        if(results){
            return res.json({status : 300, group: results});
        }else{
            return res.json({status : 404});
        }
    });

});

router.get('/:name', index.getMyFriends, index.GetMyGroups, index.GetMyChannels, function(req, res) {

    groups.getGroup(req, res).then(function(results){
        if(results){
            res.render('group', {
              selectedGroup: res.selectedGroup,
              selectedGroupUsers : res.selectedGroupUsers,
              user: req.user,
              myself: req.user.username,
              friends: req.friend,
              groups: req.groups,
              channels: req.channels
            });
            //return res.render('home', {user: req.user, friends: req.friend, groups: req.groups});
        }else{
            return res.jqXHR({status : 404});
        }
    });

});

router.get('/kick/:name', function(req, res) {

    console.log(req.params.name);
    groups.kickMember(req, res).then(function(results){
        if(results){
            return res.json({status : 300});
        }else{
            return res.json({status : 404});
        }
    });

});

router.get('/del/:name', index.getMyFriends, index.GetMyGroups, index.GetMyChannels, function(req, res) {

      groups.delGroup(req, res).then(function(results){
          if(results){
              return res.json({status : 300});
          }else{
              return res.json({status : 404});
          }
      });
});

module.exports = router;
