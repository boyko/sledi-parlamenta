var urlInfo = require('url')
var Downloader = require('downloader');
var InputManager = require('./input')
var $ = require('cheerio');

// input handling
var inputMan = new InputManager();
var argv = inputMan.getArguments();

var logger = require('logger-generator')(inputMan.retrieveLoggerConfig(argv))
var downloader =  new Downloader(logger, [1000, 5000]);

function getFullUrl(el) {
  return "http://www.parliament.bg" + $(el).attr('href');
}

function scrapeSession(url, html) {
  var date = $(".dateclass", html).text().trim()
             .replace(/(\d{2})\/(\d{2})\/(\d{4})/g, function(match, d, m, y) { return [y, m, d].join("-") });
  var stenograph = $("#leftcontent .markcontent", html).text();
  var name = $("#leftcontent .marktitle", html).contents().eq(0).text();

  console.log(JSON.stringify({
    name: name,
    date: date,
    url: url,
    stenograph: stenograph
  }));
}

function scrapeSessions(html) {
  $("#monthview a", html).each(function(i, el) {
    var url = getFullUrl(el);
    downloader.get(url, function(html) {
      scrapeSession(url, html)
    });
  });
}

function scrapeMonths(html) {
  $("#calendar a", html).each(function(i, el) {
    var url = getFullUrl(el);
    downloader.get(url, scrapeSessions);
  });
}

function scrapeCommittees(html) {
  $(".DataBlock a", html).each(function(i, el) {
    var url = getFullUrl(el) + "/steno";
    downloader.get(url, scrapeMonths);
  });
}

function init() {
  downloader.get(argv.url, scrapeCommittees);
}

init();
