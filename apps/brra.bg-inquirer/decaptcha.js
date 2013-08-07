var Decaptcha = require('../../common/node/decaptcha');

var loggerConfig = {
    type: "file",
    details: {
        filename: 'error.log'
    }
}
var logger = require('../../common/node/logger')(loggerConfig)

var image = new Buffer(0)
process.stdin.resume();
process.stdin.on('data', function(buf) {
    image = Buffer.concat([image, buf])
});

process.stdin.on('end', function() {
    var decaptcha = new Decaptcha();
});