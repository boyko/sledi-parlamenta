var spawn = require('child_process').spawn;
var Downloader = require('../../common/node/downloader');

var loggerConfig = {
    type: "file",
    details: {
        filename: 'error.log'
    }
}
var logger = require('../../common/node/logger')(loggerConfig)
var request = new Downloader(logger);
var decaptcha  = spawn('node', ['decaptcha.js']);

decaptcha.stdout.pipe(process.stdout);
request.get(process.argv[2]).pipe(decaptcha.stdin)