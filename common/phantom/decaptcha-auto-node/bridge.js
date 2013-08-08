// Phantomjs cant download files so this script serves as a bridge between
// the decaptcha app (that accepts a stream of data) and phantom.
// It's doing so by simply downloading a file and streaming it to the decaptcha

var path = require('path');
var spawn = require('child_process').spawn;

var pathToDecaptcha = path.join(__dirname,'../../../apps/decaptcha');
var Downloader = require('../../node/downloader');

var loggerConfig = {
    type: "file",
    details: {
        filename: 'error.log'
    }
}
var logger = require('../../node/logger')(loggerConfig)
var request = new Downloader(logger);
var decaptcha  = spawn('node', [pathToDecaptcha]);

decaptcha.stdout.pipe(process.stdout);
request.get(process.argv[2]).pipe(decaptcha.stdin)