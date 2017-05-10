module.exports = {

  connectMongo: function (callback, req, res) {
    var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/qwirk';
    var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(mongodbUrl, callback)
  },

  addChannel: function (req, res) {
    Q = require('q');
    var deferred = Q.defer();
    var channelName = req.body.name;
    var username = req.user.username;
    this.connectMongo(function (err, db) {
      var channelCollection = db.collection('channels');
      var userschannelCollection = db.collection('users_channels');
      channelCollection.findOne({'name': channelName})
        .then(function (result) {
          if (null != result) {
            console.log("CHANNELNAME ALREADY EXISTS:", result.name);
            deferred.resolve(false);
          } else {
            console.log("CREATING CHANNEL:", channelName);
            channelCollection.insert({name: channelName,admin: username})
            .then(function () {db.close()});
            userschannelCollection.insert({channel_name: channelName,user: username})
            .then(function () {db.close()});
            deferred.resolve(true);
          }
        return deferred.promise;
      })
    });
  }
};