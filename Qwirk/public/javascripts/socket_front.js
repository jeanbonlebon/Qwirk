//var socket = io.connect('http://localhost:8080');
var socket = io();

var room = $('#relation').text();
var username = $('#relation_me').text();

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
  // call the server-side function 'adduser' and send one parameter (value of prompt)
  socket.emit('adduser', username);

  //Call the room
  socket.emit('switchRoom', room);
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, data) {
  $('#conversation').append('<div class="receive"><img src="/images/img1.png"><div class="text">'+
  data +'</div><span>'+ username +' - '+ getDate() +'</span></div>');

});

/*
// listener, whenever the server emits 'updaterooms', this updates the room the client is in
socket.on('updaterooms', function(rooms, current_room) {
  $('#rooms').empty();
  $.each(rooms, function(key, value) {
    if(value == current_room){
      $('#rooms').append('<div>' + value + '</div>');
    }
    else {
      $('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
    }
  });
});

function switchRoom(room){
  socket.emit('switchRoom', room);
}
*/

// on load of page
$(function(){
  //alert(getDate());
  // when the client clicks SEND
  $('#datasend').click( function() {
    //if( !$('#data').val() ) {
      var message = $('#data').val();
      $('#data').val('');
      $("#conversation").append("<div class=\"sender\"><div class=\"text\">"+message+"</div><span>"+username+" - "+getDate()+"</span></div>");

    //}
    // tell server to execute 'sendchat' and send along one parameter
    socket.emit('sendchat', message);
  });

  // when the client hits ENTER on their keyboard
  $('#data').keypress(function(e) {
    if(e.which == 13) {
      $(this).blur();
      $('#datasend').focus().click();
    }
  });
});
