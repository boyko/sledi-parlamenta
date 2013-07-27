var sys = require("system");
var fs = require('fs');
var page = require("webpage").create();

var url = "http://dv.parliament.bg/DVWeb/broeveList.faces";
var step = 1;

// Reference: https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage
page.onLoadFinished = function(status) {
	if (step == 1) {
		console.log("### STEP 1: Зареди страницата с броевете");
		step++;
		page.evaluate(function() {
			var ev = document.createEvent("MouseEvents");
			ev.initEvent("click", true, true);
			document.querySelector("#navlist1 a:nth-child(2)").dispatchEvent(ev);
		});
	} else {
		console.log("### STEP 2: Screenshot");
		page.render('export.png');
		phantom.exit()
	}
}

// Start
page.open(url);