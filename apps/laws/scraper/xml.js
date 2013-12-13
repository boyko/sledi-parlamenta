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
                   .spread(function(xmlUrl, billUrl, html) {
                        if (!xmlUrl || !billUrl) return;
                        self.scrapeXML(xmlUrl, billUrl, html);
                    })
    },

    findXML: function(url) {
        var self = this;
        var baseUrl = self._getBaseUrl(url)
        var done = flow.defer()
        self.downloader.get(url, function(html) {
            var $content = $('#leftcontent', html);
            var xmlLink = $content.find('a').eq(0);
            var billLink = $content.find('table.bills a').eq(0);
            var lawTextHtml = $content.find('table.bills > tr > td[colspan="2"]').html();
            if (xmlLink.length == 0 || billLink.length == 0 || lawTextHtml.length == 0) {
                if (xmlLink.length == 0) {
                    self.logger.info('No XML link found at '+ url)
                }
                if (billLink.length == 0) {
                    self.logger.info('No Bill link found at '+ url)
                }
                if (lawTextHtml.length == 0) {
                    self.logger.info('No law text found at '+ url)
                }
                done.resolve()
                return;
            }
            done.resolve([baseUrl+xmlLink.attr('href'), baseUrl+billLink.attr('href'), lawTextHtml])
        })
        return done.promise;
    },

    scrapeXML: function(xmlUrl, billUrl, lawTextHtml) {
        var self = this;
        var entry = {
            "lawTextHtml": lawTextHtml.trim(),
            "importers": [],
            "committees": [],
            "history": [],
            "reports": []
        }
        var xmlDone = flow.defer()
        self.downloader.get(xmlUrl, function(xml) {
            var $xml = $('schema', xml);
            entry.lawName = $xml.find('LawName').text().trim()
            entry.signature = $xml.find('Signature').attr('value').trim()
            entry.createdOn = $xml.find('Date').attr('value').trim()
            entry.revisionId = $xml.find('Session').attr('value').trim()
            entry.stateGazetteIssue = [parseInt($xml.find('SGIss').text().trim()), parseInt($xml.find('SGYear').text().trim())]
            entry.billName = $xml.find('BillName').text().trim()
            xmlDone.resolve()
        })

        var baseUrl = self._getBaseUrl(billUrl)
        var billDone = flow.defer()
        self.downloader.get(billUrl, function(html) {
            var $content = $('table.bills', html);
            var $importers = $content.find('td:contains("Вносители")').next().find('a');
            var $committees = $content.find('td:contains("Разпределение по комисии")').next().find('a');
            var $reports = $content.find('td:contains("Доклади от комисии")').next().find('a');
            var $history = $content.find('td:contains("Хронология")').next().find('li');

            $importers.each(function() {
                entry.importers.push({
                    name: $(this).text().trim(),
                    link: baseUrl+$(this).attr('href').trim()
                })
            })
            $committees.each(function() {
                entry.committees.push({
                    name: $(this).text().trim(),
                    link: baseUrl+$(this).attr('href').trim()
                })
            })
            $reports.each(function() {
                entry.reports.push({
                    name: $(this).text().trim(),
                    link: $(this).attr('href').trim()
                })
            })
            $history.each(function() {
                var $this = $(this)
                var text = $this.text().split('-');
                var date = text[0].trim();
                var action = text[1].trim();
                entry.history.push({
                    date:date,
                    action:action
                })
//                var day = parseInt(date[0]);
//                var month = parseInt(date[1])-1;
//                var year = parseInt(date[2]);
            })
            billDone.resolve()
        })
        return flow.all([billDone.promise, xmlDone.promise]).then(function() {
            console.log(JSON.stringify(entry))
        });
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
