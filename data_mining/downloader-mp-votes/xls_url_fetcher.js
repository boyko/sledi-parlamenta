var Crawler = require("crawler").Crawler;

var assemblies = {
  41: "http://www.parliament.bg/bg/plenaryst/ns/7",
  42: "http://www.parliament.bg/bg/plenaryst/ns/50",
}

var c = new Crawler({ "maxConnections": 10 });

function cbSession(error, result, $) {
  var xls = [];
  var date = $(".marktitle").eq(0).text().match(/\d+\/\d+\/\d+/g)[0]
             .replace(/(\d+)\/(\d+)\/(\d+)/g, function(match, d, m, y) { return [y, m, d].join("-") });

  $(".frontList a[href$='.xls']").each(function(idx, el) {
    xls.push(el.href);
  })

  var stenograph = $(".markcontent").text();

  console.log(JSON.stringify({
    date: date,
    xls: xls,
    url: result.uri,
    stenograph: stenograph
  }));
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


