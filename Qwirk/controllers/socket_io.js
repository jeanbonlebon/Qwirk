module.exports = function(io, sockets_usernames) {

  var usernames = {};
  var rooms = ['room1'];

  io.sockets.on('connection', function (socket) {

  	socket.on('adduser', function(username){
  		socket.username = username;
  		usernames[username] = username;
  		socket.emit('updaterooms', rooms, 'room1');
  	});

  	socket.on('sendchat', function (data) {
  		socket.broadcast.to(socket.room).emit('updatechat', socket.username, data);
  	});

  	socket.on('switchRoom', function(newroom){
  		socket.leave(socket.room);
  		socket.join(newroom);
  		socket.room = newroom;
  		socket.emit('updaterooms', rooms, newroom);
  	});

  	socket.on('disconnect', function(){
  		delete usernames[socket.username];
  		io.sockets.emit('updateusers', usernames);
  		socket.leave(socket.room);
  	});
  });

};
