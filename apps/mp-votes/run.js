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
	// Creates a scraper
	var scraper = new TranscriptScraper(argv.temp, logger);

	// Finds transcripts and extract data
    var lastInQueue = flow()
	crawler.on('plenary', function(transcriptUrl) {
        // Slow down scraping
        lastInQueue = lastInQueue.then(function() {
            return scraper.run(transcriptUrl)
        }).delay(5000)
	})
    crawler.run()
}).fail(function(err) {
    console.log(err)
})