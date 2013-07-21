var winston = require('winston');
require('winston-loggly');
//winston.add(winston.transports.Loggly, {});
//require('winston-papertrail').Papertrail;

exports = module.exports = function() {
	var logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)()
		]
	});
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