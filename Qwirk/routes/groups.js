var express = require('express');
var router  = express.Router();
var groups = require('../controllers/groups.js');

router.post('/add', function(req, res, next) {
  var result = groups.addGroup(req, res);
  res.send();
});

router.get('/:name', function(req, res) {

    groups.getGroup(req, res).then(function(results){
        if(results){
            return res.json({
              selectedGroup: res.selectedGroup,
              selectedGroupUsers : res.selectedGroupUsers,
              myself: req.user.username
            });
            //return res.render('home', {user: req.user, friends: req.friend, groups: req.groups});
        }else{
            return res.jqXHR({status : 404});
        }
    });

});

module.exports = router;
