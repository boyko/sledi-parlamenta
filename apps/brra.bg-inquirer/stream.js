var request = require('request');
var argv = require('optimist')
	.usage('Streams the downloading of a URL.\nUsage: $0')
	.options('u', {
		demand: true,
		alias: 'url',
		description: 'Url to to download'
	}).wrap(100)
	.argv
;
request(argv.url).pipe(process.stdout)