var BrraShort = require('crawler/short.js')
var Decaptcha = require('../../common/phantom/decaptcha-manual')

var brra = new BrraShort("Иван Иванов Иванов", new Decaptcha('/var/tmp'));
brra.on('searchresults', function() {
    var entries = brra.tab.evaluate(function() {
        var searchWrapper = document.querySelector(".search_results");
        var results = searchWrapper.querySelectorAll('tr')
        var entries = []
        results.forEach(function (row) {
            var company = row.querySelector("a");
            if (company == null) return;
            var title = row.querySelector('td');
            entries.push({
                "title": title,
                "company": company
            })
        });
    })
    console.log(JSON.stringify(entries))
})