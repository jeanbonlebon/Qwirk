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
  logger = require('morgan'),
  stylus = require('stylus');

var fs = require('fs');
var WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

var config = require('./config.js'),
  frie = require('./controllers/friends.js'),
  groups = require('./controllers/groups.js'),
  channels = require('./controllers/channels.js');

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var friend = require('./routes/friend');
var groups = require('./routes/groups');
var channels = require('./routes/channels');

var app = express();


// Configure express to use handlebars templates
var hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: 'views/partials/',
  helpers: {
    //Parse response in json
    toJSON: function (object) {
      return JSON.stringify(object);
    },
    //Check if user is admin of the group
    ifCondGrp: function (v1, v2, options) {
      var v2 = options['data']['root']['selectedGroup'][0]['admin'];
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    //Check if user is admin of the channel
    ifCondChl: function (v1, v2, options) {
      var v2 = options['data']['root']['selectedChannel'][0]['admin'];
      if (v1 === v2) {
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
// app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
var sessionMiddleware = session({
  secret: 'supernova',
  saveUninitialized: true,
  resave: true
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
/*
app.use(stylus.middleware(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public')));
*/
//app.use(express.static('public/'));

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

  next();
});


app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/friend', friend);
app.use('/groups', groups);
app.use('/channels', channels);

module.exports = app;


//===============PORT=================
const serverConfig = {
  key: fs.readFileSync('public/key.pem'),
  cert: fs.readFileSync('public/cert.pem'),
};

var server = require('https').createServer(serverConfig, app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 5050;

var httpServer = server.listen(port, '0.0.0.0')
console.log('Server listening at port %d', port);

// Chatroom
var numUsers = 0;

io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

var users = {};

io.on('connection', function (socket) {
  var session = socket.request.session;
  if (!session.passport || !session.passport.user) return socket.disconnect();
  var addedUser = false;

  socket.user = session.passport.user.username;
  ++numUsers;
  socket.emit('login', {
    numUsers: numUsers
  });
  socket.broadcast.emit('user joined', {
    username: socket.user,
    numUsers: numUsers
  });

  users[socket.user] = socket;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    if (data && users[data.target]) {
      users[data.target].emit('new message', {
        username: socket.user,
        message: data.message
      });
    } else {
      socket.broadcast.emit('new message', {
        username: socket.user,
        message: data.message
      });
    }
  });

  socket.on('message', function (data) {
    console.log('received: %s', data);
    socket.broadcast.emit('message', data);
  });

  // when the client emits 'typing'
  socket.on('typing', function (data) {
    if (data && users[data.target]) {
      users[data.target].emit('typing', {
        username: socket.user,
      });
    } else {
      //, we broadcast it to others
      socket.broadcast.emit('typing', {
        username: socket.user,
      });
    }
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.user
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.user,
        numUsers: numUsers
      });
      delete users[socket.user];
    }
  });
});

/*
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
*/