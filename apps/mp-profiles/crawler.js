var 
	$            = require('cheerio'),
	urlInfo      = require('url'),
	util         = require('util'),
	Downloader   = require('../../common/node/downloader'),
	EventEmitter = require('events').EventEmitter;


/**
 * Creates a crawler.
 * @param url
 * @constructor
 */
function Crawler ( url, logger ) {

	this.baseUrl    = urlInfo.parse( url );
	this.baseUrl    = this.baseUrl.protocol + '//' + this.baseUrl.host;
	this.url        = url;
	this.logger     = logger;
	this.downloader = new Downloader( logger );
}
// util.inherits( BrraShort, EventEmitter );

Crawler.prototype = {

	url        : null,
	baseUrl    : null,
	logger     : null,
	downloader : null,

	/**
	 * 
	 */
	getProfileUrls : function ( url, callback ) {
		var 
			self = this,
			$profileLinks,
			profileUrl,
			profileUrls = [];

		this.downloader.get( url, function ( response ) {

			$profileLinks = $('.MPinfo a', response );
			$profileLinks.each( function ( index, domNode ) {

				profileUrl = $(domNode).attr('href');

				if( profileUrl ){
					profileUrls.push( profileUrl );
				} else {
					// TODO: log error
					console.log( 'couldnt find profile link' );
				}
			});

			callback( profileUrls );
		});

	},

	crawlUrl : function ( url, callback ) {
		this.downloader.get( urlInfo.resolve( this.baseUrl, url ), function ( response ) {
			callback( response, url );
		});
	}

};

exports = module.exports = Crawler;