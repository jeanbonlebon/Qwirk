$(function() {

  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      belowOrigin: true, // Displays dropdown below the button
      stopPropagation: false // Stops event propagation
    }
  );

  $('.modal').modal();

  //Tooltip for group users
  $('.tooltipped').tooltip({delay: 50});


  $('.modal-footer > a.group').click(function () {
    var groupName = $('input#group_name').first().val();
    $.post('/groups/add', { name: groupName })
      .done(function( data ) {
          window.location.href = "/groups/"+data.group;
      })
      .fail(function() {alert( "error" )})
  })
  $('.modal-footer > a.channel').click(function () {
    var channelName = $('input#channel_name').first().val();
    $.post('/channels/add', { name: channelName })
      .done(function( data ) {
          //window.location.href = "/channels/"+data.group;
      })
      .fail(function() {alert( "error" )})
  })
/////////////////// GROUPS ///////////////////////////////
$('#quit_group .modal-footer > a.validate').click(function () {
  var groupNametoQuit = $('input#gpname_quit').val();
  var groupUsertoQuit = $('input#guser_quit').val();
  console.log(groupNametoQuit+groupUsertoQuit);

  $.get('/groups/kick/'+groupUsertoQuit, {name: groupUsertoQuit, group: groupNametoQuit})
    .done(function( data ) {
        window.location.href = "/";
    })
    .fail(function() {alert( "error" )})

})
  $('#del_group .modal-footer > a.validate').click(function () {
    var groupNametoDel = $('input#gpname_del').val();
    $.get('/groups/del/'+groupNametoDel, { name: groupNametoDel })
      .done(function( data ) {
          window.location.href = "/";
      })
      .fail(function() {alert( "error" )})
  })
  $('#admin_group .modal-content a.group_member').click(function () {
    var group_member = $(this).attr('id');
    var groupNametoDel = $('input#gpname_del').val();

    $.get('/groups/kick/'+group_member, {name: group_member, group: groupNametoDel})
      .done(function( data ) {
          window.location.href = "/groups/"+groupNametoDel;
      })
      .fail(function() {alert( "error" )})

  })

  //SocketIO Initiator and Closure
  $('#local-sign-in').submit(function(event){
    var socket = io();
    console.log('USER !')
    //socket.emit('connexion', 'data');
    socket.emit('connexion', 'data');
  });
  $('#logout_user').click(function () {
    var socket = io();
    socket.disconnect();
  });

});
