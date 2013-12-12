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
    aop.on('searchresults', function() {
        var entries = aop.tab.evaluate(function() {
            var searchWrapper = document.querySelector("#resultaTable");
            var resultsRows = [].slice.call(searchWrapper.querySelectorAll('tr'))

            var entries = []
            var isOrderSeparator = function(row) {
                return row.querySelector("hr") != null;
            }
            var isListingEnd = function(row) {
                return row.querySelector("hr") != null && row.nextElementSibling.querySelector("img") != null;
            }
            var order = {}
            resultsRows.every(function (row) {
                if (isListingEnd(row)) {
                    if (Object.keys(order).length>0) entries.push(order)
                    return false;
                }
                if (isOrderSeparator(row)) {
                    if (Object.keys(order).length>0) entries.push(order)
                    order = {}
                    return true;
                }
                var rowCells = row.querySelectorAll("td");
                var key = rowCells[0].textContent.trim();
                var valueEl = rowCells[1]
                var value;
                if (valueEl.querySelector("a")!=null) {
                    value = {text: valueEl.textContent.trim(), link:  valueEl.querySelector("a").getAttribute('href')}
                } else {
                    value = valueEl.textContent.trim()
                }
                order[key] = value
                return true;
            });
            return entries;
        })
        console.log(JSON.stringify(entries))
    })
    aop.run();
}