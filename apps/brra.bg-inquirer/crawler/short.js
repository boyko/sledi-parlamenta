require('../node_modules/phantomjs-nodify');
var util = require('util');
var flow = require('../node_modules/q');
var decaptcha = require('../../../common/phantom/node-decaptcha');

function BrraShort(name) {
    var self = this;
    this.name = name;
    this.tab = require("webpage").create();
    this.tab.onLoadFinished = function (status) { self.flow.resolve(status); }
}
util.inherits(BrraShort, EventEmitter);

BrraShort.prototype.name = null;
BrraShort.prototype.tab = null;
BrraShort.prototype.flow = null;
BrraShort.prototype._step = function(logic) {
    var self = this;
    return function() {
        self.flow = flow.defer();
        logic.apply(this, arguments);
        return self.flow.promise;
    }
};
BrraShort.prototype.run = function() {
    var self = this;
    var step = this._step; // shortcut to step func

    // Start
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
        return decaptcha(captchaUrl)
    })

    // Submit form
    .then(step(function(captchaText) {
        self.tab.evaluate(function() {
            var ev = document.createEvent("MouseEvents");
            ev.initEvent("click", true, true);
            var form = document.querySelector('.search_form');
            form.querySelector('input[name*="CaptchaControl"]').value = solution;
            form.querySelector('input[name*="OrganizationName"]').value = mpName;
            form.querySelector('input[name*="btnSearch"]').dispatchEvent(ev);
        }, captchaText)
    }))

    // Announce finish
    .then(function() {
        self.emit('searchresults')
    })
}
module.exports = exports = BrraShort;

