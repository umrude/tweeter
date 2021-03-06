/* eslint-disable no-undef */
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//stops XSS attacks
const escape = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// creates new tweet article
const createTweetElement = (data) => {
  let avatar = data.user['avatars'];
  let name = data.user['name'];
  let username = data.user['handle'];
  let tweetcontent = data.content['text'];
  let time = data["created_at"];
  let timestamp = moment(time).fromNow(); //uses momentJS to turn into human readable format
  //string literal containing html format to be returned
  const newElement = `
 <article class="tweet">
      <header>
        <img id="img" src="${avatar}">
        <h4 id="name">${name}</h4>
        <h4 id="username">${username}</h4>
      </header>

      <p id="tweettext">${escape(tweetcontent)}</p>
      
      <footer>
        <p id="timestamp"><small>${timestamp}</small></p>
        <p><small>
          <a href="#"><i class="fa fa-flag" aria-hidden="true"></i></a>
          <a href="#"><i class="fa fa-retweet" aria-hidden="true"></i></a>
          <a href="#"><i class="fa fa-heart" aria-hidden="true"></i></a>
        </small></p>
      </footer>
    </article>
`;
  return newElement;
};

//loops through all tweets and renders them one by one
const renderTweets = function(tweets) {
  const container = $('#tweets-container');
  for (let x in tweets) {
    container.prepend(createTweetElement(tweets[x]));
  }
};

//gets tweets from /tweets and renders all of them
const loadTweets = function() {
  $.ajax('/tweets', {
    method: 'GET',
    success: function(data) {
      renderTweets(data);
    }
  });
};

//prepends new tweet to list of tweets
const renderNewTweet = function(tweet) {
  $('#tweets-container').prepend(createTweetElement(tweet));
};

//gets the new tweet to be rendered on submit click
const loadNewTweets = function() {
  $.ajax('/tweets', {
    method: 'GET',
    success: function(data) {
      renderNewTweet(data[data.length - 1]);
    }
  });
};

$(document).ready(function() {

  // loads tweets on load
  loadTweets();
  
  //errors hidden on load
  $('#error2long').slideUp();
  $('#errorMuchEmpty').slideUp();

  //area to compose tweet is hidden on load
  $(".new-tweet").slideUp();
  
  //event handler for when the "tweet" button is clicked
  $("form").on("submit", function(event) {
    event.preventDefault();

    let $text = $(this).parent().find('textarea');
    let $textLength = $($text).val().length;
    let $textValue = $($text).val();
    let $data = $(this).serialize();

    if ($textLength > 140) {
      $('#errorMuchEmpty').slideUp(); //errors don't overlap
      $('#error2long').slideDown();
    } else if ($textValue === "") {
      $('#error2long').slideUp();
      $('#errorMuchEmpty').slideDown();
    } else {
      $("#error2long").slideUp(); //for animation vs errors just disappearing
      $('#errorMuchEmpty').slideUp();
      $($text).val(''); //clears text area
      $('.counter').html("140"); //resets char counter
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: $data,
        success: function() {
          loadNewTweets();
        }
      });
    }
  });

  //when writeTweet is clicked, the new tweet area is toggled with the text area in focus
  $("#writeTweet").click(function() {
    $(".new-tweet").slideToggle();
    $("textarea").focus();
  });

  //event handler for when the "scroll to top" button should appear
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#fixedButton').fadeIn();
      $('#fixedButton').removeClass('hidden');
    } else {
      $('#fixedButton').fadeOut();
      $('#fixedButton').addClass('hidden');
    }
  });

  //event handler for when the "scroll to top" button is clicked
  $("#fixedButton").click(function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  });
});