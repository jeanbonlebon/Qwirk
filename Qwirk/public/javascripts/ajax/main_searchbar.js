$(function() {
    var friends = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
          wildcard: '%QUERY',
          url : '/friend/findFriend/%QUERY',
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
          url : '/channels/findChannels/%QUERY',
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

    if (friendUsername !== undefined){
        var parameters = { data : friendUsername };
        console.log(parameters);

        targetElement.parent('a').hide();
        targetElement.parent('a').next('.preloader').show();

        
        $.post('/friend/addFriend', parameters, function(data) {
          }).done(function (data) {
              targetElement.parent('a').next('.preloader').hide();
              targetElement.parent('a').next('.preloader').next('.check').show();
              console.log('done !');
          }).fail(function (jqXHR, textStatus) {
              targetElement.parent('a').next('.preloader').hide();
              targetElement.parent('a').show();
              console.log('fail !');
          });
        
    }

    if (channelName !== undefined){
        var parameters = { data : channelName };
        console.log(parameters);

        targetElement.parent('a').hide();
        targetElement.parent('a').next('.preloader').show();
    }

    return false;
  }
