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
    var avatar = req.user.avatar;
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
            userschannelCollection.insert({channel_name: channelName,user: username,avatar: avatar})
            .then(function () {db.close()});
            deferred.resolve(true);
          }
        return deferred.promise;
      })
    });
  },


  getChannel: function (req, res) {
    Q = require('q');
    var deferred = Q.defer();
    var name = req.params.name;

    this.connectMongo(function (err, db) {
      var channelCollection = db.collection('channels');
      var usersChannelCollection = db.collection('users_channels');

      channelCollection.find({'name': name})
        .toArray(function (err, results) {
          if (err) {
            deferred.resolve(false);
          } else {
            res.selectedChannel = results;
            usersChannelCollection.find({'channel_name': name})
              .toArray(function (err, results) {
                if (err) {
                  deferred.resolve(false);
                } else {
                  res.selectedChannelUsers = results;
                  deferred.resolve(true);
                  return res;
                }
              })
          }
      })
    });
    return deferred.promise;
  },


  getChannelsList: function (req, res) {

    this.connectMongo(function (err, db) {
      var collection = db.collection('users_channels');

      var channelResult = [];
      var mySelf = req.user.username;

      var req_String = req.params[0];
      var req_StringClear = req_String.substring(14);

      collection.find({
          $and: [{
              user: {
                $ne: mySelf
              }},{
              channel_name: {
                '$regex' : '^'+req_StringClear+'', '$options' : 'i'
              }}
            ]
        })
        .toArray(function (err, results) {
          if (err) {
            res.json("Error");
          }
          console.log(results);
          results.forEach(function (results) {
              channelResult.push(results.channel_name);
          });
          console.log(channelResult);
          db.close();
          res.json(channelResult);
        })
    });
  }


};
