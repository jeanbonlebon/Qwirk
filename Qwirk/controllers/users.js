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
    console.log('555555555555555555555555' + username + '55555555555555555555555555555')
    this.connectMongo(function (err, db) {
      var collection = db.collection('localUsers');

      collection.find({'username': username})
        .toArray(function (err, results) {
          if (err) {
            console.log('/////////////////////////////////////////////////////////');
            console.log('PROUT');
            console.log('/////////////////////////////////////////////////////////');
            deferred.resolve(false);
          } else {
            db.close();
            res.selectedUser = results;
            console.log('/////////////////////////////////////////////////////////');
            console.log(res.selectedUser);
            console.log('/////////////////////////////////////////////////////////');
            deferred.resolve(true);
            return res.selectedUser;
          }
      })
    });
    return deferred.promise;
  }
};
