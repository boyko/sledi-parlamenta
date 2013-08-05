var brraTab = require("webpage").create();
var captchaTab = require("webpage").create();
var nodejs = require("webpage").create();

var firstUrl = "https://public.brra.bg/CheckUps/Verifications/VerificationPersonOrg.ra";
var mpName = "Иван Иванов Иванов"
var EventEmitter = require('events').EventEmitter

var brra = new EventEmitter()

// Reference: https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage
brraTab.onLoadFinished = function(status) {
    brra.emit('landingPage', status)
}

brraTab.open(firstUrl, function(status) {
    var captchaUrl = document.querySelector('[src^="Capt"]').src;
    captchaTab.open(captchaUrl, function(status) {
        //@todo finish
        nodejs.open('http://localhost:3590/', 'POST', captchaTab.content, function(status) {
            var solution  = JSON.parse(nodejs.content).solution;
            var ev = document.createEvent("MouseEvents");
            ev.initEvent("click", true, true);
            document.querySelector('.search_form').querySelector('input[name*="CaptchaControl"]').value = solution;
            document.querySelector('.search_form').querySelector('input[name*="OrganizationName"]').value = mpName;
            document.querySelector('.search_form').querySelector('input[name*="btnSearch"]').dispatchEvent(ev);
        });
    });

    // some sudo code
    brraTab.onThirdReload(function() {
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


});