module.exports = {

  connectMongo: function (callback, req, res) {
    var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/qwirk';
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(mongodbUrl, callback)
  },


    getUserList: function (req, res) {

    this.connectMongo(function (err, db) {
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
  },

  GetAUser: function (req, res) {
    Q = require('q');
    var deferred = Q.defer();
    var username = req.params.username;

    this.connectMongo(function (err, db) {
      var collection = db.collection('users');

      collection.find({'username': username})
        .toArray(function (err, results) {
          if (err) {
            deferred.resolve(false);
          } else {
            db.close();
            res.selectedUser = results;
            deferred.resolve(true);
            return res.selectedUser;
          }
      })
    });
    return deferred.promise;
  }
};
