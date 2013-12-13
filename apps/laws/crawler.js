var $ = require('cheerio');
var urlInfo = require('url');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Crawler = function(url, target, logger, downloader) {
	this.baseUrl = urlInfo.parse(url);
	this.baseUrl = this.baseUrl.protocol+'//'+this.baseUrl.host
	this.url = url;
	this.logger = logger;
	this.downloader = downloader;

	if (target instanceof Date) {
		this.startDate = target;
	} else {
		this.forced = target;
	}
}

util.inherits(Crawler, EventEmitter);

Crawler.prototype.baseUrl = null;
Crawler.prototype.url = null;
Crawler.prototype.startDate = null;
Crawler.prototype.forced = null;
Crawler.prototype.logger = null;
Crawler.prototype.downloader = null;

Crawler.prototype.run = function() {
    var self = this;
    self.downloader.get(this.url, function(html) {
        var $calender= $('#calendar', html);
        var $monthsLinks = $calender.find('a').filter(function() {
            var hrefTokens = $(this).attr('href').split('/');
            var date = hrefTokens[hrefTokens.length-1].split('-');
            var month = parseInt(date[1])-1;
            var year = parseInt(date[0]);
            return self._shouldCrawl(year, month);
        })
        $monthsLinks.each(function() {
            self.processMonth(self.baseUrl+$(this).attr('href'));
        })
    })
}

Crawler.prototype.processMonth = function(url) {
    var self = this;
    self.downloader.get(url, function(html) {
        var $list= $('#monthview', html);
        var $lawLinks = $list.find('a').filter(function() {
            var date = $(this).parent().text().split(', ')[1].split('/');
            return self._shouldCrawl(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[1]))
        })
        $lawLinks.each(function() {
            self.emit('law', self.baseUrl+$(this).attr('href'))
        })
    })
}

Crawler.prototype._shouldCrawl = function(year, month, day) {
    if (this.startDate != null) {
        var d = this.startDate;
        return year >= d.getYear() && month >= d.getMonth && (typeof day == 'undefined' || day > d.getDate());
    }
    if (this.forced == null) return true;

    // User has passed array of years
    if (this.forced instanceof Array && this.forced.indexOf(year)==-1) return false;
    // User has passed array of months or hash map of months, each with array of days
    if (typeof this.forced[year] == 'undefined') return false;
    // User hasn't passed a month, return true
    if (typeof month == 'undefined') return true;

    // User has passed array of months
    if (this.forced[year] instanceof Array && this.forced[year].indexOf(month)==-1) return false;
    // User has passed hash map of months, each with array of days
    if (typeof this.forced[year][month] == 'undefined') return false;
    // User hasn't passed a day, return true
    if (typeof day == 'undefined') return true;

    // Checks for specific date
    return this.forced[year][month].indexOf(day) > -1;
}

exports = module.exports = Crawler;