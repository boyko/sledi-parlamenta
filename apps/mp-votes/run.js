var Crawler = require('./crawler')
var TranscriptScraper = require('./transcriptScraper/excel')
var Downloader = require('../../common/node/downloader')
var InputManager = require('./input')

var inputMan = new InputManager();
var argv = inputMan.getArguments();
// Run crawler & Scraper
inputMan.findTargetDates(argv).then(function(target) {
	// Creates a logger
	var logger = require('../../common/node/logger')(inputMan.retrieveLoggerConfig(argv))
	// Creates a downloader
	var downloader =  new Downloader(logger, [1000,5000]);
	// Creates a crawler
	var crawler = new Crawler(argv.url, target, logger, downloader);
	// Creates a scraper
	var scraper = new TranscriptScraper(argv.temp, logger, downloader);

	// Finds transcripts and extract data
	crawler.on('plenary', function(transcriptUrl) {
        return scraper.run(transcriptUrl)
	})
    crawler.run()
}).fail(function(err) {
    console.log(err)
})