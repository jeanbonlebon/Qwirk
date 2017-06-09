var express = require('express');
var router = express.Router();

var passport = require('passport'),
    LocalStrategy = require('passport-local');
    funct = require('../controllers/authentification');

router.get('/', function(req, res){
    res.render('home', {user: req.user});
});


/*
var io = req.app.io;
io.on('connection', function(socket){
    console.log("connected from the client side");
});
*/

router.get('/signin', function(req, res){
    res.render('signin');
});


router.post('/local-reg', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
  })
);


router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
  })
);


router.get('/logout', function(req, res){
  /*
  var io = req.app.io;
  io.on('connection', function(socket){
      socket.on('disconnect', function(){
          console.log( socket.name + ' has disconnected from the chat.' + socket.id);
      });
  });
  */
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});

module.exports = router;

//===============PASSPORT=================
// Use the LocalStrategy within Passport to login/"signin" users.
passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.';
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

passport.use('local', new LocalStrategy(
  {passReqToCallback : true},
  function(req, username, password, done) {
    funct.localReg(username, password)
    .then(function (user) {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'That username is already in use, please try a different one.'; 
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});
