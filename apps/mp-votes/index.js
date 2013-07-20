var Crawler = require('./crawler')
var TranscriptScraper = require('./transcriptScraper')

// Creates a crawler
var latestTranscriptDate = 'query the database for the latest transript date as unix timestamp'
latestTranscriptDate = new Date(latestTranscriptDate * 1000)
var crawler = new Crawler('http://www.parliament.bg/bg/plenaryst', latestCrawlDate);

// Finds transcripts that are not in the database
crawler.findNewTranscripts(function(transcriptUrl) {
	var transcript = new TranscriptScraper(transcriptUrl);
	transcript.scrape();
});