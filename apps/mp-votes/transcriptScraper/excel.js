var path = require('path');
var urlInfo = require('url');
var when = require('q');
var $ = require('cheerio');

var csv = require('../../../common/node/csv-util');
var Convertor = require('../../../common/node/spreadsheet2csv-node');

var Scraper = function(tempDir, logger, downloader) {
	this.tempDir = tempDir;
	this.logger = logger;
	this.downloader = downloader;
	this.convertor = new Convertor(logger);
}

Scraper.prototype = {
	url: null,
	tempDir: null,
	date: null,
	logger: null,
	convertor: null,
	run: function(url) {
		var self = this;
        var baseUrl = self._getBaseUrl(url)
        var done = when.defer()
		self.downloader.get(url, function(html) {
			var $article = $('#leftcontent', html);
			var $spreadsheets = $article.find('.frontList a[href$=".xls"]');
			var $groupLink = $spreadsheets.filter('[href*="gv"]');
			var $individualLink= $spreadsheets.filter('[href*="iv"]');
			if ($spreadsheets.length==0 || $groupLink.length==0 || $individualLink.length==0) {
				if ($spreadsheets.length==0) self.logger.info("Can't find any XLS docs at: "+url)
				if ($spreadsheets.length && $groupLink.length==0) self.logger.info("Can't find group voting link at: "+url)
				if ($spreadsheets.length && $individualLink.length==0) self.logger.info("Can't find individual voting link at: "+url)
                done.resolve()
				return;
			}
			self.date = $article.find('.markframe .dateclass').text();

			var topicsExtraction = when.defer();
			var groupDownload = self.downloadAndConvert(
                baseUrl + $spreadsheets.filter('[href*="gv"]').attr('href')
			);
			when.done(groupDownload, function(outputPath) {
				topicsExtraction.resolve(self.extractTopicsFromGroupVotingCSV(outputPath))
			});

			var individualDownload = self.downloadAndConvert(baseUrl+$spreadsheets.filter('[href*="iv"]').attr('href'));
            when.all([individualDownload, topicsExtraction.promise, url]).spread(self.extractIndividualVotesFromCSV.bind(self)).then(done.resolve).fail()
		})
        return done.promise;
	},
	downloadAndConvert: function(url) {
		var self = this;
		var task = when.defer();
		var urlTokens = url.split('/');
		var name = urlTokens[urlTokens.length-1];
		var downloadPath = path.join(this.tempDir, name)
		var outputPath = downloadPath.replace('.xls', '.csv');
		self.downloader.save(url, downloadPath, function() {
			self.convertor.convert(downloadPath, outputPath, function() {
				task.resolve(outputPath);
			})
		})
		return task.promise;
	},
	extractTopicsFromGroupVotingCSV: function(path) {
		var task = when.defer();
		var markers = {
			registration: "РЕГИСТРАЦИЯ",
			voteSplitter: "по тема",
			vote: "ГЛАСУВАНЕ"
		}
		var getNum = function(title) {
			var match = /Номер\s*\(?(\d+)\)?/.exec(title);
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
		reader.on('end', function(){
            task.resolve(topics);
        })

		return task.promise;
	},

	/**
	 * Processes CSV and forms
	 * @param path
	 * @param topics
	 */
	extractIndividualVotesFromCSV: function(path, topics, url) {
		var self = this;
		var done = when.defer();
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
				votes: [],
                source: url
			}
			row.forEach(function(val, i) {
				if (i==0 && val!='') {
					record.name = val;
				}
				if (val=='' || i < 4) return;
				var topic = topics.titlesByNum[headers[i]]

				if (!topics.metadataByTitle[topic]) {
                    self.logger.info("Don't have metadata for topic '"+topic+"' at: "+url)
                }
				var entry = {
					time: topics.metadataByTitle[topic].time,
					val: valueMapping[val],
          topic: topic
				}
				if (topics.isRegistration(topic)) {
					record.registration = entry
				} else {
					record.votes.push(entry)
				}
			})
  			console.log(JSON.stringify(record))
		})
        .on('end', function(count){
            done.resolve()
        })
        return done.promise
	},

    /**
     * Extracts base url from full link
     * @param url
     * @returns {string}
     * @private
     */
    _getBaseUrl: function(url) {
        url = urlInfo.parse(url);
        return url.protocol+'//'+url.host
    }
}

exports = module.exports = Scraper;
