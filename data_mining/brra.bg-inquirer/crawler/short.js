var EventEmitter = require('events').EventEmitter;
var util = require('util');
var flow = require('../node_modules/q');

function BrraShort(name, decaptcha) {
    var self = this;
    this.name = name;
    this.decaptcha = decaptcha;
    this.tab = require("webpage").create();
    this.tab.onLoadFinished = function (status) {self.flow.resolve(status); }
    this.tab.settings.loadImages = false;
    this.tab.settings.webSecurityEnabled  = false;
}
util.inherits(BrraShort, EventEmitter);

BrraShort.prototype.name = null;
BrraShort.prototype.tab = null;
BrraShort.prototype.flow = null;
BrraShort.prototype.decaptcha = null;
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

    // Start
    flow("https://public.brra.bg/CheckUps/Verifications/VerificationPersonOrg.ra")

    // Open brra.bg landing page
    .then(this._step(function(url) {
        self.tab.open(url);
    }))

    // Fetch captcha text
    .then(function() {
        var captchaUrl = self.tab.evaluate(function() {
            return document.querySelector('[src^="Capt"]').src;
        })
        return self.decaptcha.solve(captchaUrl)
    })

    // Submit form
    .then(this._step(function(captchaText) {
        self.tab.evaluate(function(captchaText, name) {
            var ev = document.createEvent("MouseEvents");
            ev.initEvent("click", true, true);
            var form = document.querySelector('.search_form');
            form.querySelector('input[name*="CaptchaControl"]').value = captchaText;
            form.querySelector('input[name*="OrganizationName"]').value = name;
            form.querySelector('input[name*="btnSearch"]').dispatchEvent(ev);
        }, captchaText, self.name)
    }))

    // Announce finish
    .then(function() {
        self.emit('searchresults')
    })
}
module.exports = exports = BrraShort;

