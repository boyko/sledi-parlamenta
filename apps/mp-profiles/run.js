var
	fs       = require('fs'),
	when     = require('q'),
	logger   = require('../../common/node/logger'),
	events   = require('events'),
	eventBus = new events.EventEmitter(),
	Crawler  = require('./crawler'),
	Scraper  = require('./scraper'),
	mpCrawler,
	mpScraper,

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
		type    : "simple",
		details : {
			filename : 'error.log'
		}
	};

function saveToFile ( filename, data )
{
	if ( typeof data === 'object' ) {
		data = JSON.stringify( data );
	}

	fs.writeFile( argv.temp + '/' + filename, data, 'utf8', function ( err ){
		if( err ){
			console.log(err);
		}
	});
}


// Creates a logger
logger = logger( loggerSettings );

// Creates a crawler
mpCrawler = new Crawler ( argv.url, logger );


// Run crawler & Scraper
( function () {

	mpCrawler.getProfileUrls( argv.url, function ( profileUrls ) {
		var item = profileUrls[10];

		// @TODO: cycle through all
		// loop is commented out so we can test with only a single MP
		// profileUrls.forEach( function ( item, index ) {
			mpCrawler.crawlUrl( item, function ( response, url ) {
				eventBus.emit( 'profileReceived', response, url );
			});
		// });
	});

	eventBus.on( 'documentRequested', function ( url, callback ) {
		mpCrawler.crawlUrl( url, callback );
	});

	eventBus.on( 'profileReceived', function ( profileHtml, profileUrl ) {
		var mpScraper = new Scraper( argv.temp, logger );

		mpScraper.on( 'documentNeeded', function( url, callback ){
			eventBus.emit( 'documentRequested', url, callback );
		});

		mpScraper.on( 'profileComplete', function ( profile ) {

			// @TODO: outup stream
			// save output to file while developing
			saveToFile( profile.url.replace(/\//ig,''), profile );

		});

		mpScraper.parseProfile( profileHtml, profileUrl );
	});

})();