// This script collects publicly available information from
// the government's website and prints it to stdout.

var Crawler = require("crawler").Crawler;

// to get the urls call 'Session.all.map(&:url)' in the rails console
var urls = ["http://www.parliament.bg/bg/plenaryst/ns/7/ID/3108"]

var c = new Crawler({
  "maxConnections": 10,

  "callback": function(error, result, $) {
    text = $(".markcontent").text();
    id = result.uri.match(/\d+$/)[0];
    console.log(JSON.stringify({ id: id, text: text }))
  }

});

c.queue(urls)


