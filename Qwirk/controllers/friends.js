Q = require('q'),
config = require('../config.js'); //config file contains all tokens and other private info

var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/users';
var MongoClient = require('mongodb').MongoClient

exports.getFriendList = function(req, res){

  MongoClient.connect(mongodbUrl, function (err, db) {
    var collection = db.collection('localUsers');

    var userResult = [];
    collection.find({},{_id:0, password:0, avatar:0 }).toArray(function(err, cursor){

      cursor.forEach(function(results){
          userResult.push(results.username)
      });
      db.close();
      res.json(userResult);
    });
  });
}

exports.AddAFriend = function(req, res){

    var deferred = Q.defer();
    var mySelf = req.user.username;
    var myFriend = req.body.data;

  MongoClient.connect(mongodbUrl, function (err, db) {
    var collection = db.collection('friendRelation');

    collection.findOne({"friend1" : mySelf, "friend2" : myFriend})
        .then(function (result){
            if (null != result) {
              console.log("Relation Already Exist with:", mySelf + " and " +  myFriend);
              deferred.resolve(false);
            }
            else  {
              var friendRel = {
                "friend1": mySelf,
                "friend2": myFriend,
                "friend1_username": "",
                "friend2_username": "",
              }
              collection.insert(friendRel)
                .then(function () {
                    db.close();
                    deferred.resolve(true);
                });
            }
        })
    });

    //console.log(deferred.promise);
    return deferred.promise;
  }
