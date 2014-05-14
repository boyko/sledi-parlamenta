var Crawler = require("crawler").Crawler;

var assemblies = {
  41: "http://www.parliament.bg/bg/plenaryst/ns/7",
  42: "http://www.parliament.bg/bg/plenaryst/ns/50",
}

var c = new Crawler({ "maxConnections": 10, });

function cbSession(error, result, $) {
  path = $(".frontList a[href$='.xls']").eq(1).attr("href");
  url = "http://www.parliament.bg" + path;
  console.log(url);
}

function cbMonth(error, result, $) {
  $('#monthview a:contains("Пленарно заседание")').each(function(idx, el) {
    c.queue({ "uri": el.href, "callback": cbSession });
  });
}

function cbAssembly(error, result, $) {
  $('.calendar_columns a').each(function(idx, el) {
    c.queue({ "uri": el.href, "callback": cbMonth });
  });
}

var chosen = process.argv[2];

c.queue({ "uri": assemblies[chosen], "callback": cbAssembly });


