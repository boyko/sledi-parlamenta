var Crawler = require("crawler").Crawler;

var assemblies = {
  41: "http://www.parliament.bg/bg/plenaryst/ns/7",
  42: "http://www.parliament.bg/bg/plenaryst/ns/50",
}
var logger = require('../common/node/logger')({
	"type": "file",
	"details": {
		"filename": "error.log"
	}
})


var c = new Crawler({ "maxConnections": 10 });

function cbSession(error, result, $) {
  var xls = [];
  var url = result.url;

  if (error) {
    logger.info("Can't retrieve: " + url)
    return;
  }
  var date = $(".marktitle").eq(0).text().match(/\d+\/\d+\/\d+/g)[0]
             .replace(/(\d+)\/(\d+)\/(\d+)/g, function(match, d, m, y) { return [y, m, d].join("-") });


  var $links = $('.frontList a');
  var $spreadsheets = $links.filter('[href$=".xls"]');
  if ($spreadsheets.length < 1) {
    logger.info("Missing XLS document(s) at: " + url)
  }

  $spreadsheets.each(function(idx, el) {
    xls.push(el.href);
  })

  var stenograph = $(".markcontent").text();

  console.log(JSON.stringify({
    date: date,
    xls: xls,
    url: url,
    stenograph: stenograph
  }));
}

function scrapeSessions(error, result, $) {
  $('#monthview a:contains("Пленарно заседание")').each(function(idx, el) {
    c.queue({ "uri": el.href, "callback": cbSession });
  });
}

function scrapeMonths(error, result, $) {
  $('.calendar_columns a').each(function(idx, el) {
    c.queue({ "uri": el.href, "callback": scrapeSessions });
  });
}

var chosen = process.argv[2];

c.queue({ "uri": assemblies[chosen], "callback": scrapeMonths });


