var 
$          = require('cheerio'),
urlInfo    = require('url'),
Downloader = require('../../common/node/downloader'),

/**
 * Creates a crawler.
 * @param url
 * @constructor
 */
Crawler = function ( url, logger ) {

	this.baseUrl    = urlInfo.parse( url );
	this.baseUrl    = this.baseUrl.protocol + '//' + this.baseUrl.host;
	this.url        = url;
	this.logger     = logger;
	this.downloader = new Downloader( logger );

};

Crawler.prototype = {

	url        : null,
	baseUrl    : null,
	logger     : null,
	downloader : null,

	/**
	 * Starts the crawl
	 * @param callback
	 */
	fetchProfiles : function ( callback ) {
		this.crawlMPs( callback );
	},

	/**
	 * 
	 */
	crawlMPs : function ( callback ) {
		var 
			self = this,
			$profileLinks,
			urlComponents, 
			url, 
			mpid;

		this.downloader.get( this.url, function ( response ) {

			$profileLinks = $('.MPinfo a', response );
			// $profileLinks.each( function ( index, domNode ) {
			( function ( index, domNode ) {

				url = $(domNode).attr('href');
				if( url ){
					urlComponents = url.split('/');
					mpid = parseInt( urlComponents[ urlComponents.length - 1 ], 10 );

					self.crawlProfileXml( mpid, callback );

				} else {
					// TODO: log error
					console.log( 'couldnt find profile link' );
				}
			})( 0, $profileLinks[0] );
			// });	
		});

	},

	crawlProfileXml : function ( mpid, callback ) {
		
		var profileUrl = this.getProfileUrl( mpid, 'xml' );

		this.downloader.get( profileUrl, function ( response ) {
			callback( response, mpid );
		});

	},

	getProfileUrl : function ( mpid, type ) {

		var result = '';

		switch ( type ) {
			case 'profile':
				result = this.baseUrl + '/bg/MP/' + mpid;
				break;

			case 'xml':
			default:
				result = this.baseUrl + '/export.php/bg/xml/MP/' + mpid;
				break; 
		}

		return result;

	}

};

exports = module.exports = Crawler;