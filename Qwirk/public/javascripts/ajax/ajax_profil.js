$(function() {
    /*
    $("#myProfil").click(function (e) {
        e.preventDefault();
        var username = $(this).attr('rel');
        $('#loader').show();
      $.get('/users/'+username, function(data) {
        }).done(function (data) {
            console.log(data);
            MyProfile(data);
            $('#loader').hide();
            console.log('done !');
        }).fail(function (jqXHR, textStatus) {
            console.log('fail !');
        });

    });
    */
});

Handlebars.registerHelper('toJSON', function(obj) {
  return JSON.stringify(obj);
});

function MyProfile(data2){

    var source;
    var template;
    var html;

    $.ajax({
        url: '/views/componements/profile.handlebars',
        cache: true,
        success: function(data) {
            source    = data;
            template  = Handlebars.compile(source);
            html = template(data2);
            $('#playground').html(html);
        }
    });
}
