var Downloader = require('downloader');
var InputManager = require('./input');
var $ = require('cheerio');
var Q = require('q');

// input handling
var inputMan = new InputManager();
var argv = inputMan.getArguments();

var logger = require('logger-generator')(inputMan.retrieveLoggerConfig(argv))
var downloader =  new Downloader(logger, [1000, 5000]);

function getFullUrl(pathOrElement) {
  return "http://www.parliament.bg" + (typeof pathOrElement === "string" ? pathOrElement : $(el).attr('href'));
}

function scrapeReport(url, html) {
  var text = $("#leftcontent1 .markcontent", html).text(),
      date = $('#leftcontent1 .dateclass', html).text().trim(),
      committee = $('#leftcontent1 .marktitle', html).contents()[0].data;
      console.log(date);

  return {
    url: url,
    text: text,
    date: date,
    committee: committee
  }
}

function scrapeBills(url, html) {
  var $content = $('table.bills', html),
      gov_id = url.match(/\d+$/g)[0],
      name = $("tr:contains('Име на законопроекта') td strong", $content).eq(0).text(),
      signature = $("tr:contains('Сигнатура') td", $content).eq(1).text(),
      session = $("tr:contains('Сесия') td", $content).eq(1).text(),
      date = $("tr:contains('Дата на постъпване') td", $content).eq(1).text(),
      rtf = $("tr:contains('Текст на законопроекта') td a:contains('RTF')", $content).attr('href'),
      importers = [],
      committees = [],
      reports = [],
      history = [];

  $("tr:contains('Вносители') a", $content).each(function(idx, el) {
    importers.push({
      link: $(el).attr("href"),
      name: $(el).text()
    });
  });

  $("tr:contains('Разпределение по комисии') li", $content).each(function(idx, el) {
    committees.push({
      link: $("a", el).attr("href"),
      name: $("a", el).text(),
      leading: $(el).text().match(/\((.*)\)$/)[1]
    });
  });

  $("tr:contains('Доклади от комисии') a", $content).each(function(idx, el) {
    reports.push($(el).attr("href"));
  });

  $("tr:contains('Хронология') li", $content).each(function(idx, el) {
    var text = $(el).text();
    var status = text.match(/\d{2}\/\d{2}\/\d{4} - (.*)/)[1];
    var date = text.match(/\d{2}\/\d{2}\/\d{4}/)[0].replace(/(\d{2})\/(\d{2})\/(\d{4})/, function(match, d, m, y) { return [y, m, d].join("-") });

    history.push({
      date: date,
      status: status
    });
  });

  promisedReports = reports.map(function(report_path) {
    var report_url = getFullUrl(report_path);
    return downloader.get(report_url).then(function(html) { return scrapeReport(report_url, html) }, 
                                           function(error) { logger.error(error) });
  });

  // when reports are fetched - assemble the final results and print to STDOUT.
  Q.all(promisedReports).done(function(results) {

    console.log(JSON.stringify({
      gov_id: gov_id,
      name: name,
      date: date,
      signature: signature,
      session: session,
      importers: importers,
      committees: committees,
      reports: results,
      history: history,
      rtf: rtf
    }));

  }, function(error) { logger.error(error) });

}

function scrapeBillURLS(html) {
  $("#monthview ul.frontList li a", html).each(function(idx, el) {
    var url = getFullUrl(el)
    downloader.get(url, function(html) {
      scrapeBills(url, html);
    });
  });
}

function scrapeMonths(html) {
  $(".calendar_columns a", html).each(function(idx, el) {
    var url = getFullUrl(el)
    downloader.get(url, scrapeBillURLS);
  });
}

function init() {
  downloader.get(argv.url, scrapeMonths);
  //downloader.get("http://www.parliament.bg/bg/bills/ID/14141", function(html) { scrapeBills("http://www.parliament.bg/bg/bills/ID/14141", html) } )
}

init();

