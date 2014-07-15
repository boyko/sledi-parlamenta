require('./node_modules/phantomjs-nodify');
var BrraShort = require('./crawler/short.js')
var fs = require('fs');
var Decaptcha;
var argv = require('optimist')
    .usage('Crawls brra.bg and extracts businesses\' details for all the provided names.\nUsage: phantomjs --ignore-ssl-errors=true run.js')
    .options('i', {
        demand: true,
        alias: 'input',
        description: 'File or pipe path containing one full name on each line to be processed'
    }).options('d', {
        demand: true,
        alias: 'decaptcha',
        description: 'Either "auto" or "manual" Whether to use automatic or manual decaptcha service'
    })
    .options('t', {
        alias: 'temp',
        default: '/var/tmp',
        description: 'Temporary directory to store manual captchas'
    }).wrap(60)
    .argv;

if (argv.decaptcha=='auto') {
    Decaptcha = require('./node_modules/phantom-decaptcher/auto')
} else {
    Decaptcha = require('./node_modules/phantom-decaptcher/manual')
}

var input = fs.open(argv.input, "r")
while (fullname = input.readLine()) {
    var brra = new BrraShort(fullname, new Decaptcha(argv.temp));
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
    })
}

//$(".mlioccur .txtmark .addr").each(function(el){
//    if (/.*ЕИК|Булстат.*/.test(el.textContent)) {
//        console.log(el.textContent)
//    }
//})