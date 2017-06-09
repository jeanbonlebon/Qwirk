$(function() {
    var friends = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
          wildcard: '%QUERY',
          url : '/users/findFriend/%QUERY',
      },
      cache : false
    });

    var channels = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
          wildcard: '%QUERY',
          url : '/channels/findChannels/%QUERY',
      },
      cache : false
    });

    var myfriends = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
          wildcard: '%QUERY',
          url : '/friend/findFriend/%QUERY',
      },
      cache : false
    });

    $('#SearchFriends .typeahead').typeahead({
      highlight: true
      },
      {
        name: 'friends',
        display: 'value',
        source: friends,
        templates: {
          header: '<h3>Users</h3>',
          empty: [
          ].join('\n'),
          suggestion: function(data) {
              console.log(data);
              return '<div><strong>' + data + '</strong>' +
              '<a href="javascript:;;" id="' + data + '" class="pluss add_friend" onClick="dontClose()"><i class="material-icons">add</i></a>'+

              '<div class="preloader"><img src="/images/loading.gif"></div>'+
              '<div class="check"><i class="material-icons">done</i></div>'+

              '</div>';
          }
        }
      },
      {
      name: 'channels',
      display: 'value',
      source: channels,
      templates: {
        header: '<h3>Channels</h3>',
        empty: [
        ].join('\n'),
        suggestion: function(data) {
            console.log(data);
            return '<div><strong>' + data + '</strong>' +
            '<a href="javascript:;;" id="' + data + '" class="pluss join_channel" onClick="dontClose()"><i class="material-icons">add</i></a>'+

            '<div class="preloader"><img src="/images/loading.gif"></div>'+
            '<div class="check"><i class="material-icons">done</i></div>'+

            '</div>';
        }
      }
    });

    $('#SearchFriends .typeahead').on('typeahead:selected', function(evt, item) {
        console.log('Selection du Profil');
    })

    $('#adminBar .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
    name: 'myfriends',
    display: 'value',
    source: myfriends,
    templates: {
      empty: [
      ].join('\n'),
      suggestion: function(data) {
          console.log(data);
          return '<div><strong>' + data + '</strong>' +
          '<a href="javascript:;;" id="' + data + '" class="pluss add_frie" onClick="dontClose()"><i class="material-icons">add</i></a>'+

          '<div class="preloader"><img src="/images/loading.gif"></div>'+
          '<div class="check"><i class="material-icons">done</i></div>'+

          '</div>';
      }
    }
    });


  });

  function dontClose(e) {
     e = e || event;
    if (e.bubbles && e.stopPropagation) {
        e.stopPropagation();
    }
    else {
        e.cancelBubble = true;
    }

    var targetElement =   $(e.target);
    var friendUsername = targetElement.parent('a.add_friend').attr('id');
    var channelName = targetElement.parent('a.join_channel').attr('id');

    var friendGroup = targetElement.parent('a.add_frie').attr('id');
    var nameGroup = $('#gpname_del').val();


    if (friendUsername !== undefined){
        var parameters = { data : friendUsername };
        console.log(parameters);

        targetElement.parent('a').hide();
        targetElement.parent('a').next('.preloader').show();


        $.post('/friend/addFriend', parameters, function(data) {
          }).done(function (data) {
              targetElement.parent('a').next('.preloader').hide();
              targetElement.parent('a').next('.preloader').next('.check').show();
              window.location.href = "/users/"+parameters.data;
          }).fail(function (jqXHR, textStatus) {
              targetElement.parent('a').next('.preloader').hide();
              targetElement.parent('a').show();
              window.location.href = "/";
          });

    }

    if (channelName !== undefined){
        var parameters = { data : channelName };
        console.log(parameters);

        targetElement.parent('a').hide();
        targetElement.parent('a').next('.preloader').show();

        $.post('/channels/joinChannel', parameters, function(data) {
          }).done(function (data) {
              targetElement.parent('a').next('.preloader').hide();
              targetElement.parent('a').next('.preloader').next('.check').show();
              console.log('done !');
              window.location.href = "/channels/"+parameters.data;
          }).fail(function (jqXHR, textStatus) {
              targetElement.parent('a').next('.preloader').hide();
              targetElement.parent('a').show();
              window.location.href = "/";
          });
    }

    if (friendGroup !== undefined){
        var parameters = { data : friendGroup, gname : nameGroup };
        console.log(parameters);

        targetElement.parent('a').hide();
        targetElement.parent('a').next('.preloader').show();

        $.post('/groups/addFriend', parameters, function(data) {
          }).done(function (data) {
              targetElement.parent('a').next('.preloader').hide();
              targetElement.parent('a').next('.preloader').next('.check').show();
              window.location.href = "/groups/"+parameters.gname;
          }).fail(function (jqXHR, textStatus) {
              targetElement.parent('a').next('.preloader').hide();
              targetElement.parent('a').show();
              //window.location.href = "/groups/"+parameters.nameGroup;
          });

    }

    return false;
  }
