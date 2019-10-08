/* eslint-disable no-undef */
$(document).ready(function() {
  let counter = document.getElementsByClassName("counter")[0].innerHTML;
  $("textarea").keyup(() => {
    let textLength = $('textarea').val().length;
    let textRemaining = counter - textLength;
    let count = $(this).find('.counter');
    if (textRemaining >= 0) {
      count.html(textRemaining).addClass('grey');
    } else if (textRemaining < 0) {
      count.html(textRemaining).removeClass('grey');
      count.html(textRemaining).addClass('red');
    }
  });

});