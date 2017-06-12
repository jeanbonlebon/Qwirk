$(function() {

  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      belowOrigin: true, // Displays dropdown below the button
      stopPropagation: false // Stops event propagation
    }
  );

  $('#group_n').click(function(){
      $('.nav_admin').toggleClass('open_admin_nav');
  });

  $('.modal').modal();

  //Tooltip for group / channel users
  $('.tooltipped').tooltip({delay: 50});

    // Initializes and creates emoji set from sprite sheet
    window.emojiPicker = new EmojiPicker({
      emojiable_selector: '[data-emojiable=true]',
      assetsPath: '../images/emojis',
      popupButtonClasses: 'fa fa-smile-o'
    });
    // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
    // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
    // It can be called as many times as necessary; previously converted input fields will not be converted again
    window.emojiPicker.discover();


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
          window.location.href = "/channels/"+data.channel;
      })
      .fail(function() {alert( "error" )})
  })

  $('.delfriend').click(function () {
      var friendtoDel = $(this).attr('id');
      $('.modal_del_friend').modal('open');
      $('.modal-footer > a.validate').click(function () {

        $.get('/friend/del/'+friendtoDel, {name: friendtoDel})
          .done(function( data ) {
              window.location.href = "/";
          })
          .fail(function() {alert( "error" )})

      });
  });
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


  /////////////////// CHANNELS ///////////////////////////////
  $('#quit_channel .modal-footer > a.validate').click(function () {
    var channelNametoQuit = $('input#chname_quit').val();
    var channelUsertoQuit = $('input#chuser_quit').val();

    $.get('/channels/kick/'+channelUsertoQuit, {name: channelUsertoQuit, channel: channelNametoQuit})
      .done(function( data ) {
          window.location.href = "/";
      })
      .fail(function() {alert( "error" )})

  })
    $('#del_channel .modal-footer > a.validate').click(function () {
      var channelNametoDel = $('input#chname_del').val();
      $.get('/channels/del/'+channelNametoDel, { name: channelNametoDel })
        .done(function( data ) {
            window.location.href = "/";
        })
        .fail(function() {alert( "error" )})
    })
    $('#admin_channel .modal-content a.channel_member').click(function () {
      var channel_member = $(this).attr('id');
      var channelNametoDel = $('input#chname_del').val();

      $.get('/channels/kick/'+channel_member, {name: channel_member, channel: channelNametoDel})
        .done(function( data ) {
            window.location.href = "/channels/"+channelNametoDel;
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
