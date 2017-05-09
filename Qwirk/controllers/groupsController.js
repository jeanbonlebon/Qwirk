module.exports = {

  addGroup: function (req, res) {
    Q = require('q');
    var deferred = Q.defer();
    var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/qwirk';
    var MongoClient = require('mongodb').MongoClient;
    var groupName = req.body.name;
    var username = req.user.username;
    MongoClient.connect(mongodbUrl, function (err, db) {
      var groupCollection = db.collection('groups');
      var usersGroupCollection = db.collection('users_groups');
      groupCollection.findOne({
          'name': groupName
        })
        .then(function (result) {
          if (null != result) {
            console.log("GROUPNAME ALREADY EXISTS:", result.name);
            deferred.resolve(false);
          } else {
            console.log("CREATING GROUP:", groupName);
            groupCollection.insert({
                name: groupName,
                admin: username
              })
              .then(function () {
                db.close();
              });
            usersGroupCollection.insert({
                group_name: groupName,
                user: username
              })
              .then(function () {
                db.close();
              });
            deferred.resolve(true);
          }
          return deferred.promise;
        })
    });
  }

};