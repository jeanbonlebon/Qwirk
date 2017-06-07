module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log('///////////////5555555555////////////////////');
        console.log(socket.id);
        console.log('///////////////5555555555////////////////////');
        socket.on('84585', function(msg, user){
            console.log(socket.id);
            console.log(user);
            console.log('message: ' + msg);

            //io.emit('84585', msg);
            socket.broadcast.emit('84585', msg);
        });
    });
};
