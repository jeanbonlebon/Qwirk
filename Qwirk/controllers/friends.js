Q = require('q'),
config = require('../config.js'); //config file contains all tokens and other private info

var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/qwirk';
var MongoClient = require('mongodb').MongoClient
var deferred = Q.defer();


exports.getFriendList = function (req, res) {

  MongoClient.connect(mongodbUrl, function (err, db) {
    var collection = db.collection('users');
    var collection_frie = db.collection('users_relation');

    var userResult2 = [];
    var userResult = [];
    var mySelf = req.user.username;

    var req_String = req.params[0];
    var req_StringClear = req_String.substring(12);

    console.log(req_StringClear);

    collection_frie.find({
        friend1: mySelf
      })
      .toArray(function (err, results) {
        if (err) {
          res.json("Error");
        }
        results.forEach(function (results) {
          userResult.push(results.friend2);
        });
        userResult.push(mySelf);
        collection.find({
          $and: [{
              username: {
                $nin: userResult
              }},{
              username: {
                '$regex' : '^'+req_StringClear+'', '$options' : 'i'
              }}
            ]
          })
          .toArray(function (err, results2) {
            if (err) {
              res.json("Error");
            }
            console.log(results2);
            results2.forEach(function (results2) {
              userResult2.push(results2.username);
            });

            db.close();
            res.json(userResult2);
          })
      })
  })
}

exports.AddAFriend = function (req, res) {

  var deferred = Q.defer();
  var mySelf = req.user.username;
  var myFriend = req.body.data;

  MongoClient.connect(mongodbUrl, function (err, db) {
    var collection = db.collection('users_relation');

    collection.findOne({
        "friend1": mySelf,
        "friend2": myFriend
      })
      .then(function (result) {
        if (null != result) {
          console.log("Relation Already Exist with:", mySelf + " and " + myFriend);
          deferred.resolve(false);
        } else {
          var friendRel = {
            "friend1": mySelf,
            "friend2": myFriend,
            "friend1_username": "",
            "friend2_username": "",
            "blocked": "",
          }
          var friendRel2 = {
            "friend1": myFriend,
            "friend2": mySelf,
            "friend1_username": "",
            "friend2_username": "",
            "blocked": "",
          }
          collection.insert(friendRel)
          .then(function () {db.close()});
          collection.insert(friendRel2)
          .then(function () {db.close()});
          deferred.resolve(true);
        }
      })
  });

  //console.log(deferred.promise);
  return deferred.promise;
}
