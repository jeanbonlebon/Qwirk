$(function() {
  
  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      belowOrigin: true, // Displays dropdown below the button
      stopPropagation: false // Stops event propagation
    }
  );

  $(document).ready(function(){
    $('.modal').modal();
  });

});
