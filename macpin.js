/*eslint-env applescript */
/*eslint-env builtins */
/*eslint eqeqeq:0, quotes:0, space-infix-ops:0, curly:0*/
"use strict";
var delegate = {}; // our delegate to receive events from the webview app

var copetube = {url: 'file://' + $.app.resourcePath + '/simple.html', transparent: true};
var copetubeDev = {url: 'file:///Users/joey/src/CopeTube/browser/CopeTube/simple.html', transparent: true}; // f*it, do it live!

delegate.launchURL = function(url) {
	console.log("macpin.js: launching " + url);
	var comps = url.split(":"),
		scheme = comps.shift(),
		addr = comps.shift();
	switch (scheme + ":") {
		default:
	}
};

delegate.AppFinishedLaunching = function() {
	$.browser.unhideApp();
	$.browser.addShortcut('CopeTube', copetube);
	$.browser.addShortcut('CopeTube Dev', copetubeDev);
	$.browser.tabSelected = new $.WebView(copetube);
};

delegate; //return this to macpin
