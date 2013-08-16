require('./node_modules/phantomjs-nodify');
var BrraShort = require('./crawler/short.js')
var Decaptcha = require('../../common/phantom/decaptcha-manual')
//var Decaptcha = require('../../common/phantom/decaptcha-auto-node')

var brra = new BrraShort("Иван Иванов Иванов", new Decaptcha('/var/tmp'));
brra.run();
brra.on('searchresults', function() {
    var entries = brra.tab.evaluate(function() {
        var searchWrapper = document.querySelector(".search_results");
        var results = [].slice.call(searchWrapper.querySelectorAll('tr'))
        var entries = []
        results.forEach(function (row) {
            var company = row.querySelector("a");
            if (company == null) return;
            var title = row.querySelector('td');
            entries.push({
                "title": title.textContent.trim(),
                "company": company.textContent.trim()
            })
        });
        return entries;
    })
    console.log(JSON.stringify(entries))
    phantom.exit();
})