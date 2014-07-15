var Downloader = require('downloader')

var Crawler = require('./crawler')
var Scraper = require('./scraper/xml')
var InputManager = require('./input')

var inputMan = new InputManager();
var argv = inputMan.getArguments();
// Run crawler & Scraper
inputMan.findTargetDates(argv).then(function(target) {
    // Creates a logger
    var logger = require('logger-generator')(inputMan.retrieveLoggerConfig(argv))
    // Creates a downloader
    var downloader =  new Downloader(logger, [1000,2000]);
    // Creates a crawler
    var crawler = new Crawler(argv.url, target, logger, downloader);
    // Creates a scraper
    var scraper = new Scraper(logger, downloader);


    // Finds laws and extract data
    crawler.on('law', function(lawURL) {
        scraper.run(lawURL)
    })
    crawler.run()
})