var Crawler = require('./crawler')
var TranscriptScraper = require('./transcriptScraper')

// Creates a crawler
var crawler = new Crawler('http://www.parliament.bg/bg/plenaryst');

// Finds transcripts that are not in the database
crawler.findNewTranscripts(function(transcriptUrl) {
	var transcript = new TranscriptScraper(transcriptUrl);
	transcript.scrape();
});