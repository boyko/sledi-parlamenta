var fs = require('fs');
var request = require('request');
var logger = require('../logger')();

var headers = {
	"User-Agent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.72 Safari/537.36",
	"Accept-Encoding": "gzip,deflate",
	"Accept-Language": "bg,en-GB;q=0.8,en;q=0.6",
	"Cache-Control": "max-age=0"
}
exports = module.exports = {
	get: function(url, callback) {
		request({
			"url": url,
			"headers": headers
		}, function (err, res, html) {
			if (err || res.statusCode != 200) {
				logger.error("Can't retrieve " + url + ", "+res.statusCode + ", err: "+res.statusCode);
			}
			callback(html);
		})
	},
	save: function(url, destination, callback) {
		request({
			"url": url,
			"headers": headers
		}).pipe(fs.createWriteStream(destination)).on("finish", callback);
	}
}