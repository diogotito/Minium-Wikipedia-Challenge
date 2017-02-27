require("utils/browser-utils"); // extends $
var timeUnits = require("minium/timeunits");



//--[ Contants ]----------------------------------------------

// How many seconds/minutes/hours to wait after having posted the challenge
var HINT_DELAY = 10;

// How many seconds/minutes/hours to wait between each challenge
var CHALLENGE_INTERVAL = 20;

// How many links should Minium follow?
var JUMPS = 10;

// Should we wait for SECONDS, MINUTES or HOURS?
var TIME_UNIT = timeUnits.SECONDS;

// Fill in here the credentials for your Twitter test account
var CREDENTIALS = {
  user: "",
  email: "",
  password: ""
};



//--[ Main loop ]---------------------------------------------

while (true) {
  // Open a random Wikipedia article
  gotoRandomArticle();
  
  // Store the URL of the starting article
  var firstUrl = browser.getCurrentUrl();
  var path = [getArticleTitle()]; // The names of the visited articles
  
  for (var i = 0; i < JUMPS; i++) {
    console.log(i + ":\t" + browser.getCurrentUrl());
    clickRandomLink();
    path.push(getArticleTitle());
  }
  console.log("$:\t" + browser.getCurrentUrl());
  console.log("--------------------------------");
  
  // Store the URL of the finishing article
  var lastUrl = browser.getCurrentUrl();
  
  // Challenge human beings to get from my starting article to
  // my finishing article in 10 or less jumps
  var msg = generateMessageShort(firstUrl, lastUrl);
  console.log("Tweeting challenge...");
  tweet(msg);
  
  // After waiting a couple of minutes, have a little mercy and give
  // those poor little humans a few hints on how they can get there.
  console.log("Waiting " + HINT_DELAY + " seconds...");
  $(":root").waitTime(HINT_DELAY, TIME_UNIT);
  
  var hints = generateMessageHints(path);
  console.log("Tweeting hints...");
  tweet(hints);
  
  console.log("\n================================\n");
  console.log("Waiting " + CHALLENGE_INTERVAL + " seconds...");
  $(":root").waitTime(CHALLENGE_INTERVAL, TIME_UNIT);

} // End of Main loop



//--[ Auxiliary functions ]-----------------------------------

/**
 * Logs in to Tweeter and posts a given message
 */
function tweet(msg) {
  var Twitter = require("socialnetworks/twitter");
  
  var base = $(":root");

  var twitter = new Twitter(base, CREDENTIALS);
  twitter.tweet(msg);

}


/**
 * Starts with a random article, like this:
 * www.wikipedia.org >> [English] >> [Random article]
 */
function gotoRandomArticle() {
  browser.get("https://www.wikipedia.org/");
  $("strong").withText("English").waitForExistence().click();
  $("a").withText("Random article").waitForExistence().click();
}


/**
 * Returns the text of the article's header
 */
function getArticleTitle() {
  return $("#content h1").text();
}


/**
 * Desperately tries to follow a random link inside a Wikipedia article
 */
function clickRandomLink() {
  var links = $("p a").add("td a").freeze();
  
  var goodLinks = [];
  
  for (var i = 0; i < links.size(); i++) {
    var link = links.eq(i);
    if (/^\/wiki\/[^:?=]+$/.test(link.attr("href"))) {
      goodLinks.push(link);
    }
  }
  
  while (true) {
    // Try to click a random link
    try {
      var randomLink = goodLinks[randInt(goodLinks.length)];
      
      randomLink.scrollIntoView();
      randomLink.click();
      
      break; // Success!
    } catch (e) {} // If it didn't work, try a different link.
  }
  
  // This would be a less clunky way of doing this, but it feels like cheating
  // browser.get("https://en.wikipedia.org" + randomLink.attr("href"));
}


/**
 * Returns a short message for this challenge, suitable to post on Twitter
 */
function generateMessageShort(firstUrl, lastUrl) {
  var msg = "";
  
  msg += "I can go from " + firstUrl + " ";
  msg += "to " + lastUrl + " ";
  msg += "in 10 jumps! Can you beat my score?";
  
  return msg;
}


/**
 * Returns a message with hints for the current challenge
 */
function generateMessageHints(path) {
  var msg = "Hints:\n\n";
  
  pick3Indices(path).forEach(function (index) {
    msg += "  -> " + path[index] + "\n";
  });
  
  return msg;
}


/**
 * Returns a longer message, with hints included, more suitable to post
 * in a social network like Facebook
 */
function generateMessageLong(path, firstUrl, lastUrl) {
  var msg = "";
  
  msg += "I can go from \"" + path[0] + "\" (" + firstUrl + ") ";
  msg += "to \" " + path[path.length - 1] + "\" (" + lastUrl + ") ";
  msg += "in 10 jumps! Can you beat my score?\n\n";
  
  msg += generateMessageHints();
  
  return msg;
}



//--[ Utility functions ]-------------------------------------

/**
 * A random integer from 0 to max-1
 */
function randInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Returns 3 distinct indexes for the given array that are neither the first
 * index nor the last one. The indexes are sorted.
 */
function pick3Indices(array) {
  var indices = [];
  for (var i = 0; i < 3; i++) {
    var random;
    do {
      random = 1 + randInt(array.length - 2);
    } while (indices.indexOf(random) != -1);
    indices[i] = random;
  }
  
  return indices.sort();
}

