var Downloader = require('../common/node/downloader')
var InputManager = require('./input')
var $ = require('cheerio');

// input handling
var inputMan = new InputManager();
var argv = inputMan.getArguments();

var logger = require('../common/node/logger')(inputMan.retrieveLoggerConfig(argv))
var downloader =  new Downloader(logger, [1000, 5000]);

function getFullUrl(el) {
  return "http://www.parliament.bg" + $(el).attr('href');
}

function scrapeBills(url, html) {
  var $content = $('table.bills', html),
      gov_id = url.match(/\d+$/g)[0],
      name = $("tr:contains('Име на законопроекта') td strong", $content).eq(0).text(),
      signature = $("tr:contains('Сигнатура') td", $content).eq(1).text(),
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

  $("tr:contains('Разпределение по комисии') a", $content).each(function(idx, el) {
    committees.push({
      link: $(el).attr("href"),
      name: $(el).text()
    });
  });

  $("tr:contains('Доклади от комисии') a", $content).each(function(idx, el) {
    reports.push($(el).attr("href"));
  });

  $("tr:contains('Хронология') li", $content).each(function(idx, el) {
    history.push($(el).text());
  });

  console.log(JSON.stringify({
    gov_id: gov_id,
    name: name,
    date: date,
    signature: signature,
    importers: importers,
    comittees: committees,
    reports: reports,
    history: history,
    rtf: rtf
  }));
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

