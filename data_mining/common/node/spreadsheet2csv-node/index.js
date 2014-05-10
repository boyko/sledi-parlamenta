var path = require('path');
var exec = require('child_process').exec;

var pathToConvertor = path.join(__dirname,'../../../spreadsheet2csv/spreadsheet2csv.php');

var Convertor = function (logger) {
	this.logger = logger;
}

Convertor.prototype = {
	logger: null,
	convert: function(inputPath, outputPath, callback) {
		var self = this;
		exec("php " + pathToConvertor + ' -f '+inputPath+' -o '+outputPath, function (error, stdout, stderr) {
			if (!(error == null && stdout == '' && stderr == '')) {
				self.logger.error('conversion error! From '+inputPath+' to '+outputPath+', err:'+error+', '+stdout);
			}
			callback();
		});
	}
}

exports = module.exports = Convertor;
