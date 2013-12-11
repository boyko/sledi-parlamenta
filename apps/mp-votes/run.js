var fs = require('fs')
var when = require('q')
var Crawler = require('./crawler')
var TranscriptScraper = require('./transcriptScraper/excel')

var argv = require('optimist')
	.usage('Crawls parliament.bg and extracts MPs\' voting infromation.\nUsage: $0')
	.options('u', {
		demand: true,
		alias: 'url',
		description: 'Url to act as a start page for the crawl'
	})
	.options('d', {
		alias: 'date',
		description: 'Date as unix time. Start date for the crawl'
	})
	.options('t', {
		alias: 'temp',
		default: '/var/tmp',
		description: 'Temporary directory to store the raw transcripts'
	})
	.options('l', {
		alias: 'loggerSettingsFile',
		description: 'Settings for the logger. Accepts a filepath to the config file. If not provided, settings default to logging to error.log file '
	}).wrap(100)
	.argv
;

// Sort out correct input for targetted dates - argument or piped json with forced dates
var inputReady = when.defer();
var jsonForcedDates = '';
var loggerSettings = {
	type: "file",
	details: {
		filename: 'error.log'
	}
};
process.stdin.resume();
process.stdin.on('data', function(buf) { jsonForcedDates += buf.toString(); });
process.stdin.on('end', function() {
	if (jsonForcedDates=='') return;
	inputReady.resolve(JSON.parse(jsonForcedDates));
});
// Allow 100ms before checking for stdin
setTimeout(function(e) {
	if (jsonForcedDates=='') {
		inputReady.resolve()
		process.stdin.emit("end"); // prevents hanging due to empty stdin
	}
}, 100)

if (typeof argv.loggerSettingsFile != 'undefined') {
	loggerSettings = JSON.parse(fs.readFileSync(argv.loggerSettingsFile));
}

if (typeof argv.date != 'undefined') {
	inputReady.resolve(argv.date)
}
// Run crawler & Scraper
inputReady.promise.then(function(target) {
	// if target is not a json doc then it's a unix timestamp
	if (typeof target != 'undefined' && !(target instanceof Object)) {
		target = new Date(target * 1000)
	}
	// Creates a logger
	var logger = require('../../common/node/logger')(loggerSettings)
	// Creates a crawler
	var crawler = new Crawler(argv.url, target, logger);
	// Finds transcripts and extract data
    var lastInQueue = when()
	crawler.fetchTranscripts(function(transcriptUrl) {
        // Slow down scraping
        lastInQueue = lastInQueue.then(function() {
            var transcript = new TranscriptScraper(transcriptUrl, argv.temp, logger);
            var pause = when.defer();
            transcript.scrape().then(function() {
                setTimeout(pause.resolve, 5000)
            });
            return pause.promise;
        })
	});

})