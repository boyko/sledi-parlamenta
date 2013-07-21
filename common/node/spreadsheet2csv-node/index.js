var exec = require('child_process').exec;
var logger = require('../logger')();

var pathToConvertor = '../../../apps/spreadsheet2csv/spreadsheet2csv.php';

exports = module.exports = {
	convert: function(inputPath, outputPath, callback) {
		exec("php " + pathToConvertor + '-f '+pathToXls+' -o '+outputPath, function (error, stdout, stderr) {
			if (!(error == null && stdout == null && stderr == null)) {
				logger.error('conversion error! From '+pathToXls+' to '+outputPath);
			}
			callback();
		});
	}
}