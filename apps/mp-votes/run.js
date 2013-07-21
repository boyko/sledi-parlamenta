var Crawler = require('./crawler')
var TranscriptScraper = require('./transcriptScraper/excel')

// Creates a crawler
var latestTranscriptDate = 'query the database for the latest transript date as unix timestamp';
latestTranscriptDate = new Date(latestTranscriptDate * 1000)
var crawler = new Crawler('http://www.parliament.bg/bg/plenaryst', latestTranscriptDate);

// Finds transcripts and extract data
crawler.fetchTranscripts(function(transcriptUrl) {
	var transcript = new TranscriptScraper(transcriptUrl, '/var/tmp');
	transcript.scrape();
});