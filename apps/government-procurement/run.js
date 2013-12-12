require('./node_modules/phantomjs-nodify');
var AopShort = require('./crawler/short.js')
var fs = require('fs');
var settings = require('./settings.secret.js');
var argv = require('optimist')
    .usage('Crawls aop.bg and extracts state orders for all the provided businesses.\nUsage: phantomjs --ignore-ssl-errors=true run.js')
    .options('i', {
        demand: true,
        alias: 'input',
        description: 'File or pipe path containing one business name on each line to be processed'
    })
    .options('t', {
        alias: 'temp',
        default: '/var/tmp',
        description: 'Temporary directory to store manual captchas'
    }).wrap(60)
    .argv;

var input = fs.open(argv.input, "r")
while (business = input.readLine()) {
    var aop = new AopShort(business, settings);
    aop.run();
    aop.on('searchresults', function() {
        var entries = aop.tab.evaluate(function() {
            var searchWrapper = document.document.querySelector("#resultaTable");
            var resultsRows = [].slice.call(searchWrapper.querySelectorAll('tr'))

            var entries = []
            var isOrderSeparator = function(row) {
                return row.querySelector("hr").length > 0;
            }
            var isListingEnd = function(row) {
                return row.querySelector("hr").length > 0 && row.nextSibling..querySelector("img").length > 0;
            }
            var order = {}
            resultsRows.forEach(function (row) {
                if (isListingEnd(row)) {
                    if (Object.keys(order).length>0) entries.push(order)
                    return false;
                }
                if (isOrderSeparator(row)) {
                    if (Object.keys(order).length>0) entries.push(order)
                    order = {}
                    return;
                }
                var key = row.querySelector("td")[0].trim();
                var value = row.querySelector("td")[1].trim();
                order[key] = value
            });
            return entries;
        })
//        var entries = aop.tab.evaluate(function() {
//            return document.querySelector(".up_menu_link").textContent.trim()
//        })
//        console.log(JSON.stringify(entries))
        console.log(aop.tab.content)
    })
}