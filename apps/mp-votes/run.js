var flow = require('q')
var Crawler = require('./crawler')
var TranscriptScraper = require('./transcriptScraper/excel')
var InputManager = require('./input')

var inputMan = new InputManager();
var argv = inputMan.getArguments();
// Run crawler & Scraper
inputMan.findTargetDates(argv).then(function(target) {
	// Creates a logger
	var logger = require('../../common/node/logger')(inputMan.retrieveLoggerConfig(argv))
	// Creates a crawler
	var crawler = new Crawler(argv.url, target, logger);

	// Finds transcripts and extract data
    var lastInQueue = flow()
	crawler.fetchTranscripts(function(transcriptUrl) {
        // Slow down scraping
        lastInQueue = lastInQueue.then(function() {
            var transcript = new TranscriptScraper(transcriptUrl, argv.temp, logger);
            return transcript.scrape()
        }).delay(5000)
	});

})