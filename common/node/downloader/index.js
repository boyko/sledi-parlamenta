var request = require('request');
var winston = require('winston');
require('winston-loggly');
winston.add(winston.transports.Loggly, options);
var logger = new (winston.Logger)();
//require('winston-papertrail').Papertrail;
//var logger = new winston.Logger({
//	transports: [
//		new winston.transports.Papertrail({
//			host: 'logs.papertrailapp.com',
//			port: 12345
//		})
//	]
//});
var request = require('request');
exports = module.exports = {
	get: function(url, callback) {
		request(url, function (err, res, html) {
			if (err || res.statusCode != 200) {
				logger.error("Can't retrieve " + url);
			}
			callback(html);
		})
	}
}