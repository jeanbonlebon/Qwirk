Q = require('q'),
config = require('../config.js');

var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/qwirk';
var MongoClient = require('mongodb').MongoClient
var deferred = Q.defer();


exports.getFriendList = function (req, res) {

  MongoClient.connect(mongodbUrl, function (err, db) {
    var collection_frie = db.collection('users_relation');

    var userResult = [];
    var mySelf = req.user.username;

    var req_String = req.params[0];
    var req_StringClear = req_String.substring(12);

    collection_frie.find({
      $and: [{
          friend1: mySelf
        },{
          friend2: {
            '$regex' : '^'+req_StringClear+'', '$options' : 'i'
          }}
        ]
      })
      .toArray(function (err, results) {
        if (err) {
          db.close();
          res.json("Error");
        }
        results.forEach(function (results) {
          userResult.push(results.friend2);
        });
        db.close();
        res.json(userResult);
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
            "relation": myFriend+mySelf,
          }
          var friendRel2 = {
            "friend1": myFriend,
            "friend2": mySelf,
            "friend1_username": "",
            "friend2_username": "",
            "blocked": "",
            "relation": myFriend+mySelf,
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
