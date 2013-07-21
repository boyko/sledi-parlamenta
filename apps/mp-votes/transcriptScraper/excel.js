var path = require('path');

var when = require('q');
var $ = require('cheerio');

var csv = require('../../../common/node/csv-util');
var downloader = require('../../../common/node/downloader');
var convertor = require('../../../common/node/spreadsheet2csv-node');

var Scraper = function(url, tempDir) {
	this.url = url;
	this.tempDir = tempDir;
}

Scraper.prototype = {
	url: null,
	tempDir: null,
	date: null,
	scrape: function() {
		var self = this;
		downloader.get(this.url, function(html) {
			var $article = $('#leftcontent', html);
			var $spreadsheets = $article.find('.frontList a[href$=".xls"]');
			self.date = $article.$('.markframe .dateclass').text();

			var topicsExtraction = when.defer();
			var groupDownload = downloadAndConvert(
				$spreadsheets.filter('[href*="gv"]').attr('href')
			);
			when.done(groupDownload, function(outputPath) {
				topicsExtraction.resolve(self.extractTopicsFromGroupVotingCSV(outputPath))
			})

			var individualDownload = self.downloadAndConvert($spreadsheets.filter('[href*="iv"]').attr('href'));
			when.all([individualDownload, topicsExtraction.promise]).spread(self.extractIndividualVotesFromCSV)
		})
	},
	downloadAndConvert: function(url) {
		var task = when.defer();
		var urlTokens = url.split('/');
		var name = urlTokens[urlTokens.length-1];
		var downloadPath = path.join(this.tempDir, name)
		var outputPath = downloadPath.replace('.xls', '.csv');
		downloader.save(url, name, function() {
			convertor.convert(downloadPath, outputPath, function() {
				task.resolve(outputPath);
			})
		})
		return task;
	},
	extractTopicsFromGroupVotingCSV: function(path) {
		var task = when.defer();
		var markers = {
			registration: "РЕГИСТРАЦИЯ",
			voteSplitter: "РЕГИСТРАЦИЯ",
			vote: "ГЛАСУВАНЕ"
		}
		var getNum = function(title) {
			var match = /Номер\s*\(?(\d)\)?/.exec(title);
			if (match!=null) return match[1];
			return false;
		}
		var counter = 0;
		var reg = false;
		var topics = {
			titlesByNum: {},
			metadataByTitle: {},
			isRegistration: function(topic) {
				return topic == markers.registration
			}
		}
		var reader = csv.readFile(path);
		reader.on('record', function(row, i){
			var title = row[0];
			if (title.indexOf(markers.registration)==-1 && title.indexOf(markers.vote)==-1) return;
			reg = title.indexOf(markers.registration)!=-1;
			counter++;
			var num = getNum(title) || counter;
			var time = /\d+-\d+-\d+\s+\d+:\d+/.exec(title)
			time = time == null ? time : time[0]
			title = reg ? markers.registration : title.split(markers.voteSplitter)[1].trim();
			topics.titlesByNum[num] = title;
			topics.metadataByTitle[title] = {
				"time": time
			};
		})
		reader.on('end', function(){ task.resolve(topics);})

		return task.promise;
	},
	/**
	 * Processes CSV and forms
	 * @param path
	 * @param topics
	 */
	extractIndividualVotesFromCSV: function(path, topics) {
		var self = this
		var headers = []
		var valueMapping = {
			"П": 'present',
			'О': 'absent',
			"Р": 'manually_registered',
			'+': 'yes',
			'-': 'no',
			'=': 'abstain',
			'0': 'absent'
		}
		var reader = csv.readFile(path)
		reader.on('record', function(row, i) {
			if (i<1) return;
			if (i==1) {
				headers = row;
				return;
			}
			var record = {
				date: self.date,
				votes: []
			}
			row.forEach(function(val, i) {
				if (i==0 && val!='') {
					record.name = val;
				}
				if (val=='' || i < 3) return;
				var topic = topics.titlesByNum[headers[i]]
				var entry = {
					time: topics.metadataByTitle[topic].time,
					val: mapping[val]
				}
				if (topics.isRegistration(topic)) {
					record.registration = entry
				} else {
					record.votes.append(entry)
				}
			})
			console.log(JSON.stringify(record))
		})
	}

}

exports = module.exports = Scraper;