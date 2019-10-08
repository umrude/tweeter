/* eslint-disable no-undef */
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


const createTweetElement = (data) => {
  let avatar = data.user['avatars'];
  let name = data.user['name'];
  let username = data.user['handle'];
  let tweetcontent = data.content['text'];
  let time = data["created_at"];
  let timestamp = moment(time).fromNow();
  const newElement = `
 <article class="tweet">
      <header>
        <img id="img" src="${avatar}">
        <h4 id="name">${name}</h4>
        <h4 id="username">${username}</h4>
      </header>

      <p id="tweettext">${tweetcontent}</p>
      
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

const renderTweets = function(tweets) {
  // loops through tweets
  // calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container
  const continer = $('#tweets-container');
  for (let x in tweets) {
    continer.append(createTweetElement(tweets[x]));
  }
};

const loadTweets = function() {
  $.ajax('/tweets', {
    method: 'GET',
    success: function(data) {
      renderTweets(data);
    }
  });
};


$(document).ready(function() {
  // api calls
  loadTweets();
  //AJAX handler
  
  $("form").on("submit", function(event) {
    event.preventDefault();
    $.ajax({
      url: "/tweets",
      method: "POST",
      data: $(this).serialize(),
      success: function(data) {
        console.log(data);
      }
    });
  });
});