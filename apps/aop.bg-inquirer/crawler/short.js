var EventEmitter = require('events').EventEmitter;
var util = require('util');
var flow = require('../node_modules/q');

function AopShort(name, settings) {
    var self = this;
    this.name = name;
    this.settings = settings;
    this.tab = require("webpage").create();
    this.tab.onLoadFinished = function (status) {self.flow.resolve(status); }
    this.tab.settings.loadImages = false;
    this.tab.onConsoleMessage = function (msg) {
        console.log(msg)
    }
    this.tab.settings.webSecurityEnabled  = false;
}
util.inherits(AopShort, EventEmitter);

AopShort.prototype.name = null;
AopShort.prototype.tab = null;
AopShort.prototype.flow = null;
AopShort.prototype.settings = null;
AopShort.prototype._step = function(logic) {
    var self = this;
    return function() {
        self.flow = flow.defer();
        logic.apply(this, arguments);
        return self.flow.promise;
    }
};
AopShort.prototype.run = function() {
    var self = this;

    // Start
    flow("http://aop.bg")

    // Open aop.bg landing page
    .then(this._step(function(url) {
        self.tab.open(url);
    }))

    // Follow first JS redirect
    .then(this._step(function() {
    }))

    // Follow Second JS redirect
    .then(this._step(function() {
    }))

    // Login
    .then(this._step(function() {
        self.tab.evaluate(function(username, password) {
            var ev = document.createEvent("MouseEvents");
            ev.initEvent("click", true, true);
            var form = document.querySelector('#LoginPortletForm');
            form.querySelector("[name='ssousername']").value = username;
            form.querySelector("[name='p_request']").value = password
            form.querySelector('button').dispatchEvent(ev);
        }, self.settings.username, self.settings.password)
    }))

    // Follow first JS redirect
    .then(this._step(function() {
    }))

    // Follow Second JS redirect
    .then(this._step(function() {
    }))

    // Find advanced search link and click it
    .then(this._step(function() {
        self.tab.evaluate(function() {
            var ev = document.createEvent("MouseEvents");
            ev.initEvent("click", true, true);
            var advancedSearchLink = document.querySelector(".RegionHeaderColor a.boxLink")
            advancedSearchLink.setAttribute('target','')
            advancedSearchLink.dispatchEvent(ev);
        })
    }))

    // Search
    .then(this._step(function() {
        self.tab.evaluate(function(name) {
            var ev = document.createEvent("MouseEvents");
            ev.initEvent("click", true, true);
            document.querySelector("[name='co_word']").value=name;
            document.querySelector("[value='Търси']").dispatchEvent(ev);
        }, self.name)
    }))

    // Finish
    .then(this._step(function(url) {
        self.emit('searchresults')
    }))

}
module.exports = exports = AopShort;

