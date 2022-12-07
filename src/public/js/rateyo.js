$(function() {
  var countComment = document.getElementById('countComment');
  var comment = document.getElementsByClassName('commentLenght');
  countComment.innerHTML = '<ul class="nav nav-tabs"><li class="nav-item"><b>Bình luận ('+comment.length+')</b></li></ul>';

  var rateyo = document.getElementsByClassName('rate-yo');
  var showAvatar = document.getElementsByClassName('avatar');
  for(var i=0;i<rateyo.length;i++){
    var random = Math.floor(Math.random() * 2);
    let joeschmoe = ['joe','jocelyn','jess','jia','jai','jana','josh','jenni','jordan','james','jane','jolee','jacques','jack','jake','jon','jaqueline','jazebelle','jeane','jabala','jerry','jude','jeri','josephine','jed','jean','julie','jodi'];
    //var avatar = '<img style="border-radius: 100%;" src="https://joeschmoe.io/api/v1/'+joeschmoe[i+random]+'" width="70px" alt=""/>';
    let g = ['male', 'female', 'pixel'];
    var avatar = '<img style="border-radius: 100%;" src="https://xsgames.co/randomusers/avatar.php?g='+g[i]+'" width="70px" alt=""/>';
    showAvatar[i].innerHTML = avatar;
    $(".rate-yo").rateYo({
      rating    : rateyo[i],
    });
  }
  $(".rateYo").rateYo().on("rateyo.change", function(e, data) {
    var rating = data.rating;
    $(this).parent().find('.score').text('score :' + $(this).attr('data-rateyo-score'));
    $(this).parent().find('.result').text('rating: ' + rating);
    var rate = "<input type='text' id='rate' name='rate' value='"+ rating +"' hidden>"
    var element = document.getElementById('rating');
    element.innerHTML = rate;
  });
});