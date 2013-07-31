var fs                = require('fs'),
	when              = require('q'),
	Crawler           = require('./crawler'),
	// TranscriptScraper = require('./transcriptScraper/excel'),

	argv = require('optimist')
		.usage('Crawls parliament.bg and extracts MPs\' profiles.\nUsage: $0')
		.options('u', {
			demand      : true,
			alias       : 'url',
			description : 'Url to act as a start page for the crawl'
		})
		.options('t', {
			alias       : 'temp',
			'default'   : 'data',
			description : 'Temporary directory to store the raw profiles'
		})
		.wrap(100)
		.argv,

	loggerSettings  = {
		type    : "file",
		details : {
			filename : 'error.log'
		}
	};

// Run crawler & Scraper
( function () {
	
	// Creates a logger
	var logger = require('../../common/node/logger') ( loggerSettings );

	// Creates a crawler
	var crawler = new Crawler ( argv.url, logger );

	crawler.fetchProfiles ( function ( crawledContent, mpid ) {
		console.log('got content for ',mpid, 'sized', crawledContent.length );
		// var scraper = new ProfileScraper( argv.temp, logger );
		// scraper.updateMP( crawledContent, mpid );
	});

})();