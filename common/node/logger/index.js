var winston = require('winston');
require('winston-loggly');
//winston.add(winston.transports.Loggly, {});
//require('winston-papertrail').Papertrail;

exports = module.exports = function() {
	var logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)({
				handleExceptions: true
			})
		]
	});
	//@todo Could exiting cause problems with remote logging services?
	logger.on('logging', function (transport, level, msg, meta) {
		if (level='error') process.exit(1)
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