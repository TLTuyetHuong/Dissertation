$(document).ready(function(){
    $("#myFilter").on("keyup", function() {
          var value = $(this).val().toLowerCase();
          $("#filter div").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
    });
});