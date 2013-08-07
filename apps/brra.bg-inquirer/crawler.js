require('./node_modules/phantomjs-nodify');
var flow = require('./node_modules/q');

//@todo: extend EventEmitter so that we can emit "searchresults" event
function BrraShort(name) {
    var self = this;
    this.name = name;
    this.tab = require("webpage").create();
    this.tab.onLoadFinished = function (status) { self.flow.resolve(status); }
}
BrraShort.prototype = {
    name: null,
    tab: null,
    flow: null,
    _step: function(logic) {
        var self = this;
        return function() {
            self.flow = flow.defer();
            logic.apply(this, arguments);
            return brraFlow.promise;
        }
    },
    run: function() {
        var self = this;
        var step = this._step; // shortcut to step func

        flow("https://public.brra.bg/CheckUps/Verifications/VerificationPersonOrg.ra")

        // Open brra.bg landing page
        .then(step(function(url) {
            self.tab.open(url);
        }))

        // Fetch captcha text
        .then(function() {
            var captchaUrl = self.tab.evaluate(function() {
                return document.querySelector('[src^="Capt"]').src;
            })
            return downloadAndSolveCaptcha(captchaUrl)
        })

        // Submit form
        .then(step(function(captchaText) {
            //@todo: test swapping it with evaluateAsync and whether passing arguments to it is allowed
            self.tab.evaluate(function() {
                var ev = document.createEvent("MouseEvents");
                ev.initEvent("click", true, true);
                document.querySelector('.search_form').querySelector('input[name*="CaptchaControl"]').value = solution;
                document.querySelector('.search_form').querySelector('input[name*="OrganizationName"]').value = mpName;
                document.querySelector('.search_form').querySelector('input[name*="btnSearch"]').dispatchEvent(ev);
            }, captchaText)
        }))

        // Scrape entries
        .then(function() {
            //@todo brra.emit('searchResults', self.tab) instead of continuing the chain
            var entries = self.tab.evaluate(function() {
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
            return entries;
        })
        .then(function(entries) {
            console.log(entries)
            phantom.exit()
        })
    }
}


function downloadAndSolveCaptcha(captchaUrl) {
    var captchaReady = flow.defer();
    var spawn = require("child_process").spawn
    var decaptcha = spawn('node', ['decaptcha-phantom-bridge.js', captchaUrl]);
    var text = '';
    decaptcha.stdout.on('data', function(data) {
        text = text + data;
    })
    decaptcha.on("exit", function () {
        captchaReady.resolve(text);
    })
    return captchaReady.promise();
}