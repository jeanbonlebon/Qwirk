var express = require('express'),
    exphbs = require('express-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    path = require('path'),
    favicon = require('serve-favicon'),
    stylus = require('stylus');

var config = require('./config.js'),
    frie = require('./controllers/friends.js'),
    groups = require('./controllers/groups.js'),
    channels = require('./controllers/channels.js');


var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var friend = require('./routes/friend');
var groups   = require('./routes/groups');
var channels = require('./routes/channels');

var app = express();


// Configure express to use handlebars templates
var hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: 'views/partials/',
    helpers: {
      //Parse response in json
      toJSON : function(object) {
        return JSON.stringify(object);
      },
      //Check if user is admin of the group
      ifCondGrp : function(v1, v2, options) {
      var v2 = options['data']['root']['selectedGroup'][0]['admin'];
      if(v1 === v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      //Check if user is admin of the channel
      ifCondChl : function(v1, v2, options) {
      var v2 = options['data']['root']['selectedChannel'][0]['admin'];
      if(v1 === v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      }

    }
});



app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//===============EXPRESS================
// Configure Express
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Session-persisted message middleware
app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;


    /* Socket IO  set new clients in array */ /*
    if (req.user){

      var array = [];
      //Get the username in socket_username array
      for (let item of sockets_usernames) {
          array.push(Object.keys(item)[0])
      }

      //Check if username is already define in array
      if(!(array.includes(req.user.username))){

          //Get the last object of array
          var val = sockets_usernames[sockets_usernames.length - 1];
          //redifine new name for key with username
          if ("foo" !== req.user.username) {
              Object.defineProperty(val, req.user.username,
                  Object.getOwnPropertyDescriptor(val, "foo"));
                  console.log('55555555555555555555555555555555555555555'+val+'5555555555555555555555')
              delete val["foo"];
          }

      }

    }
    */

    next();
});


app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/friend', friend);
app.use('/groups'  , groups);
app.use('/channels', channels);

module.exports = app;


//===============PORT=================
var port = process.env.PORT || 5050;
var server = app.listen(port);

//app.listen(port);

var sockets_usernames = [];

var io = require('socket.io')(server);

require('./controllers/socket_io')(io, sockets_usernames);

console.log("here we go on " + port + "!");
