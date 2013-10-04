var 
	$            = require('cheerio'),
	urlInfo      = require('url'),
	util         = require('util'),
	xml2js 		 = require('xml2js'),
	Downloader   = require('../../common/node/downloader'),
	EventEmitter = require('events').EventEmitter;

function Scraper ( dumpFolder, logger ) {
	
	this.profile = {};
	this.waiting = [];
	this.logger  = logger;
}
util.inherits( Scraper, EventEmitter );

Scraper.prototype.profile = null;
Scraper.prototype.logger  = null;
Scraper.prototype.waiting = null;

Scraper.prototype.parseProfile = function ( htmlContent, profileUrl ) {
	var 
		self = this,
		profileXmlUrl,
		$subnav = $('.level3lnav', htmlContent );
	
	// get subnav links
	$subnav.find('a').each( function ( index, domNode ) {

		subpageUrl = $(domNode).attr('href');

		if( subpageUrl ){
			self.waitFor( subpageUrl );
			self.emit( 'documentNeeded', subpageUrl, function () {
				// keep context and arguments
				self.parseSubpage.apply( self, arguments );
			});
		}
	});

	// get xml link
	profileXmlUrl = $subnav.next().find('a').eq(0).attr('href');
	if( profileXmlUrl ){
		this.waitFor( profileXmlUrl );
		this.emit( 'documentNeeded', profileXmlUrl, function () {
			// keep context and arguments
			self.parseProfileXml.apply( self, arguments );
		});
	}

	this.profile.url = profileUrl;
	this.profile.img = $('.MPBlock2 img', htmlContent ).attr('src');
};

Scraper.prototype.parseProfileXml = function ( htmlContent, url ) {
	var
		self = this,
		xmlParser = new xml2js.Parser({
			normalizeTags : true
		});

	xmlParser.parseString( htmlContent, function ( err, result ) { 
		if ( err ) console.log( err );

		function traverseAndTransform ( obj, modifier ) {
			var key, node, wasModified;
			for ( key in obj ) {
				node = obj[ key ];	
				if ( typeof node === 'object' ) {
					if( node[0] && node[0].$ ){
						obj[ key ] = node[0].$.value;
					} else {
						traverseAndTransform( node, modifier );
					}
				}
			}
		}

		var xml = result.schema;

		traverseAndTransform( xml );


		self.profile.xml = xml;
		self.waitFor( url, true );
	});
};

Scraper.prototype.parseSubpage = function ( htmlContent, url ) {
	var 
		$sectionTitle = $('.markframe .articletitle', htmlContent ), // select the title node
		$sectionContent,
		title = '', 
		content = '';

	// if title node was not found try a different selector ( markup varies :( ... )
	if( !$sectionTitle.length ){
		$sectionTitle = $('.markframe .articletitle1', htmlContent ).first();
	}
	// extract the title text
	title = $sectionTitle.text().replace( /\n/ig, '' );

	// get the content node which is always the next one after the title
	$sectionContent = $sectionTitle.next();

	if ( $sectionContent.hasClass('markframe') ) {
		// .markframe is used when depicting a list of values
		// loop list items and exctract content in an array
		content = [];
		$sectionContent.find('li').each( function ( index, domNode ) {
			content.push( $(domNode).text() );
		});
	} else if ( !$sectionContent.hasClass('articletitle1') ) {
		// in rare cases there is no content node and the selector grabs the 
		// next section's title. In these cases we ignore the selected node and 
		// leave the content value blank
		content = $sectionTitle.next().text().replace( /\n/ig, '' );
	}

	this.profile[ title ] = content;
	this.waitFor( url, true );
};

Scraper.prototype.waitFor = function ( token, isDone ) {

	if ( isDone ) {
		this.waiting.splice( this.waiting.indexOf( token ), 1 );
	} else {
		this.waiting.push( token );
	}

	if ( !this.waiting.length ){
		this.emit( 'profileComplete', this.profile );
	}
};

exports = module.exports = Scraper;