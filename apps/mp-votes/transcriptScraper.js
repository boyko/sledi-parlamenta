var $ = require('cheerio');
var downloader = require('../common/node/downloader')
var convertor = require('../common/node/spreadsheet2csv-node')

var TranscriptScraper = function(url) {
	this.url = url;
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
		//@todo download xls
		var pathToXls = 'path to the downloaded file';
		var outputPath = 'output name based on year, month and date which are present in the url';
		convertor.convert(pathToXls, outputPath, function() {
			//@todo read CSV from outputPath as an array
			//@todo transform data, output tranformed data
		})
	},
	fetchIndividualVotes: function(url, groupVotes) {
		//@todo download xls
		var pathToXls = 'path to the downloaded file';
		var outputPath = 'output name based on year, month and date which are present in the url';
		convertor.convert(pathToXls, outputPath, function() {
			//@todo read CSV from outputPath as an array
			//@todo transform data, output tranformed data
		})
	}
}

exports = module.exports = TranscriptScraper;