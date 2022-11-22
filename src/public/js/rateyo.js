$(function() {
  var rateyo = document.getElementsByClassName('rate-yo');
  var i;
  for(i=0;i<rateyo.length;i++){
    $(".rate-yo").rateYo({
      rating    : rateyo[i],
    });
  }
  $(".rateYo").rateYo().on("rateyo.change", function(e, data) {
    var rating = data.rating;
    $(this).parent().find('.score').text('score :' + $(this).attr('data-rateyo-score'));
    $(this).parent().find('.result').text('rating: ' + rating);
    var rate = "<input type='text' name='rate' value='"+ rating +"' hidden>"
    var element = document.getElementById('rate');
    element.innerHTML = rate;
  });
});