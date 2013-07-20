var $ = require('cheerio');
var downloader = require('../common/node/downloader')

var Crawler = function(url) {
	this.url = url;
}

Crawler.prototype = {
	url: null,
	findNewTranscripts: function(callback) {
		this.processParliament(callback);
	},
	// Get voting stats about the current parliament
	processParliament: function(transcriptCallback) {
		var self = this;
		downloader.get(this.url, function(html) {
			var $calender= $('#calendar', html);
			//@todo get years already existing in db
			var existingYears = [/*query to get years in db*/]
			var $monthsLinks = $calender.find('a').filter(function() {
				return existingYears.indexOf($(this).closest('.calendar_columns').find('h4').text()) == -1
			})
			// If we have all years registered in our db, check for new months and new transcripts in the last year
			if ($monthsLinks.lenght == 0 ) {
				$monthsLinks = $calender.find('.calendar_columns:first a')
			}
			//@todo check months exist
			$monthsLinks.each(function() {
				self.processMonth($(this).attr('href'), transcriptCallback);
			})
		})
	},

	processMonth: function(url, transcriptCallback) {
		downloader.get(url, function(html) {
			var $list= $('#monthview', html);
			//@todo get dates in month already existing in db
			var existingDays = [/*query to get days in db*/]
			var $transcriptsLinks = $list.find('a').filter(function() {
				return existingDays.indexOf($(this).parent().text().split(', ')[1]) == -1
			})
			$transcriptsLinks.each(function() {
				transcriptCallback($(this).attr('href'))
			})
		})
	}
}