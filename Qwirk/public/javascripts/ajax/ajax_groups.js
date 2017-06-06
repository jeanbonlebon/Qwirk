$(function() {

/*
    $("#groupList li a").click(function (e) {
        e.preventDefault();
        var group_name = $(this).text();
        console.log(group_name);
        var parameters = { data : group_name };
        $('#loader').show();
      $.get('/groups/'+group_name, parameters, function(data) {
        }).done(function (data) {
            groupData(data);
            $('#loader').hide();
            console.log('done !');
        }).fail(function (jqXHR, textStatus) {
            console.log('fail !');
        });

    });
*/
});

Handlebars.registerHelper('ifCond', function(v1, v2, options) {

  var v2 = options['data']['root']['selectedGroup'][0]['admin'];
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('raw-helper', function(options) {
    return options.fn();
});

function groupData(data2){

    var source;
    var template;
    var html;
    console.log(data2);

    $.ajax({
        url: '/views/componements/group.handlebars',
        cache: true,
        success: function(data) {
            source    = data;
            template  = Handlebars.compile(source);
            html = template(data2);
            $('#playground').html(html);
        }
    });
}
