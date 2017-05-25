module.exports = {

  connectMongo: function (callback, req, res) {
    var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/qwirk';
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(mongodbUrl, callback)
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
