//var socket = io.connect('http://localhost:8080');
var socket = io();

var room = $('#relation').text();
var username = $('#relation_me').text();

socket.on('connect', function(){
  socket.emit('adduser', username);
  socket.emit('switchRoom', room);
});

socket.on('updatechat', function (username, data) {
  $('#conversation').append('<div class="receive"><img src="/images/img1.png"><div class="text">'+
  data +'</div><span>'+ username +' - '+ getDate() +'</span></div>');

});



$(function(){
  var $target = $('.wrapper');

  // when the client clicks SEND
  $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        $('.emoji-wysiwyg-editor').text('');
        $("#conversation").append("<div class=\"sender\"><div class=\"text\">"+message+"</div><span>"+username+" - "+getDate()+"</span></div>");
        socket.emit('sendchat', message);
        $target.animate({scrollTop: $target.height()});
  });

  // when the client hits ENTER on their keyboard
  $('.emoji-wysiwyg-editor').keypress(function(e) {
    if(e.which == 13) {
      $(this).blur();
      $('#datasend').focus().click();
    }
  });
});
