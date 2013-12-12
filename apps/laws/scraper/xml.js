var urlInfo = require('url');
var flow = require('q');
var $ = require('cheerio');

var Scraper = function(logger, downloader) {
    this.logger = logger;
    this.downloader = downloader;
}

Scraper.prototype = {
    baseUrl: null,
    downloader: null,
    logger: null,

    run: function(url) {
        var self = this;
        return self.findXML(url)
                   .then(function(xmlUrl) {
                        self.scrapeXML(xmlUrl);
                    })
    },

    findXML: function(url) {
        var self = this;
        var baseUrl = self._getBaseUrl(url)
        var done = flow.defer()
        self.downloader.get(url, function(html) {
            var xmlLink = $('#leftcontent a', html).eq(0);
            if (xmlLink.length == 0) {
                self.logger.info('No XML link found at '+ url)
            }
            done.resolve(baseUrl+xmlLink.attr('href'))
        })
        return done.promise;
    },

    scrapeXML: function(url) {
        var self = this;
        var done = flow.defer()

        self.downloader.get(url, function(xml) {
            var $xml = $('schema', xml);
            console.log($xml.find('BillName').text())
            console.log($xml.find('LawName').text())
        })
        return done.promise;
    },

    /**
     * Extracts base url from full link
     * @param url
     * @returns {string}
     * @private
     */
    _getBaseUrl: function(url) {
        url = urlInfo.parse(url);
        return url.protocol+'//'+url.host
    }
}

exports = module.exports = Scraper;
