$(function() {
  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      belowOrigin: true, // Displays dropdown below the button
      stopPropagation: false // Stops event propagation
    }
  );

  var friends = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    // url points to a json file that contains an array of country names, see
    // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
    prefetch: '/friend/findFriend',
    //prefetch: 'ressources/data.json'
  });

  $('#SearchFriends .typeahead').typeahead(null, {
    name: 'friends',
    display: 'value',
    source: friends,
    templates: {
      empty: [
        '<div class="empty-message">',
          'We cant find any user with that name, Sorry !',
        '</div>'
      ].join('\n'),
      suggestion: function(data) {
          console.log(data);
          return '<div><strong>' + data + '</strong>' +
          '<a href="javascript:;;" id="' + data + '" class="add_friend" onClick="dontClose()"><i class="material-icons">add</i></a>'+

          '<div class="preloader"><img src="public/images/loading.gif"></div>'+
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
  console.log('Ajouter Friend');
   e = e || event;
  if (e.bubbles && e.stopPropagation) {
      e.stopPropagation();
  }
  else {
      e.cancelBubble = true;
  }

  var targetElement =   $(e.target);
  var friendUsername = targetElement.parent('a').attr('id');

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

  return false;
}
