var express = require('express');
var router = express.Router();
var usr = require('../controllers/users.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:username', function(req, res) {

    usr.GetAUser(req, res).then(function(results){
        if(results){
            return res.json({selectedUser: res.selectedUser});
            //return res.render('home', {user: req.user, friends: req.friend, groups: req.groups});
        }else{
            return res.jqXHR({status : 404});
        }
    })

});

module.exports = router;
