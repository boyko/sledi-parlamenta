var BrraShort = require('crawler/short.js')

var brra = new BrraShort("Иван Иванов Иванов");
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