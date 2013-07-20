var path = require('path');
var $ = require('cheerio');
var downloader = require('../common/node/downloader')
var convertor = require('../common/node/spreadsheet2csv-node')

var TranscriptScraper = function(url, tempDir) {
	this.url = url;
	this.tempDir = tempDir;
}

TranscriptScraper.prototype = {
	url: null,
	scrape: function() {
		downloader.get(this.url, function(html) {
			var $spreadsheets = $('.frontList a[href$=".xls"]', html);
			var groupVotes = this.fetchGroup($spreadsheets.filter('[href*="gv"]').attr('href'));
			var individualVotes = this.fetchIndividual($spreadsheets.filter('[href*="iv"]').attr('href'), groupVotes);
		})
	},
	fetchGroupVotes: function(url) {
		var self = this;
		var urlTokens = url.split('/');
		var name = urlTokens[urlTokens.length-1];
		var downloadPath = path.join(this.tempDir,name)
		var outputPath = downloadPath.replace('.xls', '.csv');
		downloader.save(url, name, function() {
			convertor.convert(downloadPath, outputPath, function() {
				self.transformGroupVotesFromCSV(outputPath);
			})
		})
	},
	transformGroupVotesFromCSV: function(path) {
		//@todo read CSV as an array
		//@todo transform data, output tranformed data
	},

	fetchIndividualVotes: function(url, groupVotes) {
		var self = this;
		var urlTokens = url.split('/');
		var name = urlTokens[urlTokens.length-1];
		var downloadPath = path.join(this.tempDir,name)
		var outputPath = downloadPath.replace('.xls', '.csv');
		downloader.save(url, name, function() {
			convertor.convert(downloadPath, outputPath, function() {
				self.transformIndividualVotesFromCSV(outputPath, groupVotes);
			})
		})
	},
	transformIndividualVotesFromCSV: function(path) {
		//@todo read CSV as an array
		//@todo transform data, output tranformed data
	},

}

exports = module.exports = TranscriptScraper;