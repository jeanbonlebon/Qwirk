var config = require('../config.js'),
    Q = require('q');

var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/qwirk';
var MongoClient = require('mongodb').MongoClient
var deferred = Q.defer();

exports.getMyFriends = function(req, res, next){
  if(req.user != null){

    MongoClient.connect(mongodbUrl, function (err, db) {
      var collection = db.collection('friendRelation');
      var mySelf = req.user.username;

      collection.find({$or : [{friend1 : mySelf},{friend2 : mySelf}] })
        .toArray(function(err, results){
            if (err) {

            }
              db.close();
              req.friend = results;
              next();
        })
    });

  }else{
    next();
  }
}

exports.GetMyGroups = function(req, res, next){
  if(req.user != null){
    MongoClient.connect(mongodbUrl, function (err, db) {
      var collection = db.collection('users_groups');
      var mySelf = req.user.username;

      collection.find({user : mySelf})
        .toArray(function(err, results){
            if (err) {

            }
              db.close();
              req.groups = results;
              next();
        })
    });

  }else{
    next();
  }
}

exports.GetMyChannels = function(req, res){
  if(req.user != null){
      console.log('Mes Channels');
  }
  res.render('home', {user: req.user, friends: req.friend, groups: req.groups});

}
