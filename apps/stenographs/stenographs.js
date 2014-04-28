// This script collects publicly available information from
// the government's website and prints it to stdout.

var Crawler = require("crawler").Crawler;

// to get the urls call 'Session.all.map(&:url)' in the rails console
var urls = ["http://www.parliament.bg/bg/plenaryst/ns/50/ID/3966", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3967", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3968", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3969", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3970", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3971", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3972", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3973", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3974", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3975", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3976", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3977", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3978", "http://www.parliament.bg/bg/plenaryst/ns/50/ID/3979"];

var c = new Crawler({
  "maxConnections": 10,

  "callback": function(error, result, $) {
    text = $(".markcontent").text();
    id = result.uri.match(/\d+$/)[0];
    console.log(JSON.stringify({ id: id, text: text }))
  }

});

c.queue(urls)


