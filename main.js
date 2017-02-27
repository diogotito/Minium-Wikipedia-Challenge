require("utils/browser-utils");



// Vai a um artigo aleatorio na Wikipeda em ingles
gotoRandomArticle();

var firstUrl = browser.getCurrentUrl();
var path = [getTitle()];
for (var i = 0; i < 10; i++) {
  console.log(browser.getCurrentUrl())
  clickRandomLink();
  path.push(getTitle());
}
var lastUrl = browser.getCurrentUrl()

var msg = generateMessageShort(firstUrl, lastUrl);
console.log(msg);

tweet(msg);



function tweet(msg) {
  var Twitter = require("socialnetworks/twitter");
  
  var base = $(":root");
  var credentials = {
    email : "bottyminium",
    user : "bottyminium",
    password : "i<3botswana"
  };
  var twitter = new Twitter(base, credentials);
  twitter.tweet(msg);

}

function generateMessageShort(firstUrl, lastUrl) {
  var msg = "";
  
  msg += "I can go from " + firstUrl + " ";
  msg += "to " + lastUrl + " ";
  msg += "in 10 jumps! Can you beat my score?"
  
  return msg;
}

function generateMessageLong(path, firstUrl, lastUrl) {
  var msg = "";
  
  msg += "I can go from \"" + path[0] + "\" (" + firstUrl + ") ";
  msg += "to \" " + path[path.length - 1] + "\" (" + lastUrl + ") ";
  msg += "in 10 jumps! Can you beat my score?\n\n";
  msg += "Hints: \n"
  
  pick3Indices(path).forEach(function (index) {
    msg += "  -> " + path[index] + "\n";
  })
  
  return msg;
}


function pick3Indices(path) {
  // Obtém 3 numeros diferentes entre si
  // de 1 a path.length-2
  var indices = [];
  for (var i = 0; i < 3; i++) {
    var random;
    do {
      random = Math.floor(Math.random() * (path.length - 2)) + 1;
    } while (indices.indexOf(random) != -1)
    indices[i] = random;
  }
  
  return indices.sort();
}

function gotoRandomArticle() {
  browser.get("https://www.wikipedia.org/");
  $("strong").withText("English").click();
  $("a").withText("Random article").click();
}

function getTitle() {
  return $("#content h1").text();
}

function clickRandomLink() {
  var links = $("p a").add("td a").freeze();
  links
  
  
  var goodLinks = [];
  
  for (var i = 0; i < links.size(); i++) {
    var link = links.eq(i);
    if (/^\/wiki\/[^:?=]+$/.test(link.attr("href"))) {
      goodLinks.push(link);
    }
  }
  
  while (true) {
    // Tenta clickar nalgum link até a coisa funcionar...
    try {
      var randomIndex = Math.floor(Math.random() * goodLinks.length);
      var randomLink = goodLinks[randomIndex];
      
      // console.log(randomLink.text());
      // console.log(randomLink.attr("href"));
      
      randomLink.scrollIntoView();
      randomLink.click();
      
      break; // Success!
    } catch (e) {} // Se não deu para clickar, tenta de novo
  }
  
  // browser.get("https://en.wikipedia.org" + randomLink.attr("href"));

  // return browser.getCurrentUrl();
}
