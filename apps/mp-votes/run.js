var Crawler = require('./crawler')
var TranscriptScraper = require('./transcriptScraper/excel')
var when = require('q')
var argv = require('optimist')
	.usage('Crawls parliament.bg and extracts MPs\' voting infromation.\nUsage: $0')
	.options('u', {
		demand: true,
		alias: 'url',
		description: 'Url to act as a start page for the crawl'
	})
	.options('d', {
		alias: 'date',
		default: null,
		description: 'Date as unix time. Start date for the crawl'
	})
	.options('t', {
		alias: 'temp',
		default: '/var/tmp',
		description: 'Temporary directory to store the raw transcripts'
	})
	.argv
;

// Sort out correct input for targetted dates - argument or piped json with forced dates
var inputReady = when.defer();
var jsonForcedDates = '';
process.stdin.resume();
process.stdin.on('data', function(buf) { jsonForcedDates += buf.toString(); });
process.stdin.on('end', function() {
	if (jsonForcedDates=='') return;
	inputReady.resolve(JSON.parse(jsonForcedDates));
});
setTimeout(function(e) {
	if (jsonForcedDates=='') {
		inputReady.resolve()
		process.stdin.emit("end"); // prevents hanging due to empty stdin
	}
}, 100)

if (argv.date!=null) {
	inputReady.resolve(argv.date)
}

// Run crawler & Scraper
inputReady.promise.then(function(target) {
	// if target is not a json doc then it's a unix timestamp
	if (typeof target != 'undefined' && !(target instanceof Object)) {
		target = new Date(target * 1000)
	}
	// Creates a crawler
	var crawler = new Crawler(argv.url, target);

	// Finds transcripts and extract data
	crawler.fetchTranscripts(function(transcriptUrl) {
		var transcript = new TranscriptScraper(transcriptUrl, argv.temp);
		transcript.scrape();
	});

})