var winston = require('winston');
require('winston-loggly');
winston.add(winston.transports.Loggly, options);
//require('winston-papertrail').Papertrail;

exports = module.exports = function() {
	var logger = new (winston.Logger)();
//	var logger = new winston.Logger({
//		transports: [
//			new winston.transports.Papertrail({
//				host: 'logs.papertrailapp.com',
//				port: 12345
//			})
//		]
//	});
	return logger;
}