$(function() {
  var rateyo = document.getElementById('rateYo').getAttribute('data-rateyo-rating');
  $("#rateYo").rateYo({
    rating    : rateyo,
  });
  $(".rateYo").rateYo().on("rateyo.change", function(e, data) {
    var rating = data.rating;
    $(this).parent().find('.score').text('score :' + $(this).attr('data-rateyo-score'));
    $(this).parent().find('.result').text('rating: ' + rating);
    var rate = "<input type='text' name='rate' value='"+ rating +"' hidden>"
    var element = document.getElementById('rate');
    element.innerHTML = rate;
  });
});