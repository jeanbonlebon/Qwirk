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
            //var txt_error = result.name, "already exist";
            deferred.resolve(false);
          } else {
            channelCollection.insert({name: channelName,admin: username})
            .then(function (erreur, results) {
                if (err){
                  db.close();
                  deferred.resolve(false);
                }else{
                  userschannelCollection.insert({channel_name: channelName,user: username,avatar: avatar});
                  db.close();
                  deferred.resolve(channelName);
                }
            });
          }
        return deferred.promise;
        })
      });
    return deferred.promise;
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

  delChannel: function (req, res) {
    Q = require('q');
    var deferred = Q.defer();
    var name = req.params.name;

    this.connectMongo(function (err, db) {
      var channelCollection = db.collection('channels');
      var usersChannelCollection = db.collection('users_channels');

          channelCollection.remove({name: name})
            .then(function (erreur, results) {
                if (err){
                  db.close();
                  deferred.resolve(false);
                }else{
                  usersChannelCollection.remove({channel_name: name});
                  db.close();
                  deferred.resolve(true);
                }
          });
      });
      return deferred.promise;
  },


  kickMember: function (req, res) {
    Q = require('q');
    var deferred = Q.defer();
    var name = req.params.name;
    var channel = req.query.channel;

    console.log(name);
    console.log(channel);

    this.connectMongo(function (err, db) {
      //var groupCollection = db.collection('groups');
      var usersChannelCollection = db.collection('users_channels');

          usersChannelCollection.remove({user: name, channel_name: channel})
            .then(function (erreur, results) {
                if (err){
                  db.close();
                  deferred.resolve(false);
                }else{
                  db.close();
                  deferred.resolve(true);
                }
          });
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
  },

  joinChannel: function (req, res) {

    var deferred = Q.defer();
    var myChannel = req.body.data;
    var mySelf = req.user.username;
    var myAvatar = req.user.avatar;

    console.log(myChannel+mySelf+myAvatar)

      this.connectMongo(function (err, db) {
        var collection = db.collection('users_channels');

            collection.findOne({user: mySelf, channel_name: myChannel})
              .then(function (result) {
                  if (null != result){
                    db.close();
                    deferred.resolve(false);
                  }else{
                    var channelRel = {
                      "channel_name": myChannel,
                      "user": mySelf,
                      "avatar": myAvatar
                    }
                    collection.insert(channelRel);
                    db.close();
                    deferred.resolve(true);
                  }
            });
        });

      return deferred.promise;
  }


};
