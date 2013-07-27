var phantom = require('phantom');
var when = require('q');
var phantomjs = null;


function printArgs() {
	var i, ilen;
	for (i = 0, ilen = arguments.length; i < ilen; ++i) {
		console.log("    arguments[" + i + "] = " + JSON.stringify(arguments[i]));
	}
	console.log("");
}

// Wait for phantom
var phantomReady = when.defer();
phantom.create(function(ph) {
	phantomjs = ph;
	phantomReady.resolve();
});

var phantomas = {
	createPage: function(callback) {
		phantomReady.promise.then(function() {
			phantomjs.createPage(callback);
		})
	}
}
var pageReady = when.defer();
phantomas.createPage(function(page) {
	pageReady.resolve(page);
	page.onConsoleMessage = function (msg) {
		console.log(msg);
	};
	return page.open("http://dv.parliament.bg/DVWeb/broeveList.faces", function(status) {
		console.log("dv.parliament.bg ", status);
		page.evaluate(function() {
			var ev = document.createEvent("MouseEvents");
			ev.initEvent("click", true, true);
			var a = document.querySelectorAll("#navlist1 a:nth-child(2)");
			console.log(a)
		});
	});
});

//
//pageReady.promise.then(function(page) {
//	console.log('binding')
//	page.onInitialized = function() {
//		console.log("page.onInitialized");
//		printArgs.apply(this, arguments);
//	};
//	page.onLoadStarted = function() {
//		console.log("page.onLoadStarted");
//		printArgs.apply(this, arguments);
//	};
//	page.onLoadFinished = function() {
//		console.log("page.onLoadFinished");
//		printArgs.apply(this, arguments);
//	};
//	page.onUrlChanged = function() {
//		console.log("page.onUrlChanged");
//		printArgs.apply(this, arguments);
//	};
//	page.onNavigationRequested = function() {
//		console.log("page.onNavigationRequested");
//		printArgs.apply(this, arguments);
//	};
//
//	if (false) {
//		page.onResourceRequested = function() {
//			console.log("page.onResourceRequested");
//			printArgs.apply(this, arguments);
//		};
//		page.onResourceReceived = function() {
//			console.log("page.onResourceReceived");
//			printArgs.apply(this, arguments);
//		};
//	}
//
//	page.onClosing = function() {
//		console.log("page.onClosing");
//		printArgs.apply(this, arguments);
//	};
//
//// window.console.log(msg);
//	page.onConsoleMessage = function() {
//		console.log("page.onConsoleMessage");
//		printArgs.apply(this, arguments);
//	};
//
//// window.alert(msg);
//	page.onAlert = function() {
//		console.log("page.onAlert");
//		printArgs.apply(this, arguments);
//	};
//// var confirmed = window.confirm(msg);
//	page.onConfirm = function() {
//		console.log("page.onConfirm");
//		printArgs.apply(this, arguments);
//	};
//// var user_value = window.prompt(msg, default_value);
//	page.onPrompt = function() {
//		console.log("page.onPrompt");
//		printArgs.apply(this, arguments);
//	};
//
//})
