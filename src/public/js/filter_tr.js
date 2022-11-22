$(document).ready(function(){
    $("#myFilter").on("keyup", function() {
          var value = $(this).val().toLowerCase();
          $("#myfilter tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
    });
});x