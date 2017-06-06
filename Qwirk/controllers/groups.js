module.exports = {

  connectMongo: function (callback, req, res) {
    var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/qwirk';
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(mongodbUrl, callback)
  },

  addGroup: function (req, res) {
    Q = require('q');
    var deferred = Q.defer();
    var groupName = req.body.name;
    var username = req.user.username;
    var avatar = req.user.avatar;

    this.connectMongo(function (err, db) {
      var groupCollection = db.collection('groups');
      var usersGroupCollection = db.collection('users_groups');
      groupCollection.findOne({'name': groupName})
        .then(function (result) {
          if (null != result) {
            //var txt_error = result.name, "already exist";
            deferred.resolve(false);
          } else {
            console.log("CREATING GROUP:", groupName);
            groupCollection.insert({name: groupName,admin: username})
            .then(function (erreur, results) {
                if (err){
                  db.close();
                  deferred.resolve(false);
                }else{
                  usersGroupCollection.insert({group_name: groupName,user: username,avatar: avatar});
                  db.close();
                  deferred.resolve(groupName);
                }
            });
          }
        return deferred.promise;
      })
    });
    return deferred.promise;
  },

  getGroup: function (req, res) {
    Q = require('q');
    var deferred = Q.defer();
    var name = req.params.name;

    this.connectMongo(function (err, db) {
      var groupCollection = db.collection('groups');
      var usersGroupCollection = db.collection('users_groups');

      groupCollection.find({'name': name})
        .toArray(function (err, results) {
          if (err) {
            deferred.resolve(false);
          } else {
            res.selectedGroup = results;
            usersGroupCollection.find({'group_name': name})
              .toArray(function (err, results) {
                if (err) {
                  deferred.resolve(false);
                } else {
                  res.selectedGroupUsers = results;
                  deferred.resolve(true);
                  return res;
                }
              })
          }
      })
    });
    return deferred.promise;
  },



  delGroup: function (req, res) {
    Q = require('q');
    var deferred = Q.defer();
    var name = req.params.name;

    this.connectMongo(function (err, db) {
      var groupCollection = db.collection('groups');
      var usersGroupCollection = db.collection('users_groups');

          groupCollection.remove({name: name})
            .then(function (erreur, results) {
                if (err){
                  db.close();
                  deferred.resolve(false);
                }else{
                  usersGroupCollection.remove({group_name: name});
                  db.close();
                  deferred.resolve(true);
                }
          });
      });
      return deferred.promise;
  },


};
