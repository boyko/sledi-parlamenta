var fs = require('fs');
var request = require('request');
var logger = require('../logger')();

exports = module.exports = {
	get: function(url, callback) {
		request(url, function (err, res, html) {
			if (err || res.statusCode != 200) {
				logger.error("Can't retrieve " + url);
			}
			callback(html);
		})
	},
	save: function(url, destination, callback) {
		request(url).pipe(fs.createWriteStream(destination)).on("finish", callback);
	}
}