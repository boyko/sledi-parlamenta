var exec = require('child_process').exec;
var pathToConvertor = '../../php spreadsheet2csv.php';
var winston = require('winston');
require('winston-loggly');
winston.add(winston.transports.Loggly, options);
var logger = new (winston.Logger)();

exports = module.exports = {
	convert: function(inputPath, outputPath, callback) {
		exec(pathToConvertor + '-f '+pathToXls+' -o '+outputPath, function (error, stdout, stderr) {
			if (!(error == null && stdout == null && stderr == null)) {
				logger.error('conversion error! From '+pathToXls+' to '+outputPath);
			}
			callback();
		});
	}
}