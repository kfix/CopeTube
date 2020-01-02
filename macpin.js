/*eslint-env applescript */
/*eslint-env builtins */
/*eslint eqeqeq:0, quotes:0, space-infix-ops:0, curly:0*/
"use strict";
var delegate = {}; // our delegate to receive events from the webview app

var copetube = {
	url: `file://${$.app.resourcePath}/index.html`,
	caching: false,
	useSystemAppearance: true
};
var copetubeDev = {
	url: `file://${$.app.environment.HOME}/src/CopeTube/index.html`,
	// <kCFErrorDomainCFNetwork error 1> cannot open symlinked file:// urls !
	caching: false,
	useSystemAppearance: true
};
var copetubeWeb = {
	url: 'https://kfix.tech/CopeTube',
	useSystemAppearance: true
};
var copetubeGH = {
	url: 'https://github.com/kfix/CopeTube'
};

delegate.launchURL = function(url) {
	console.log("macpin.js: launching " + url);
	var comps = url.split(":"),
		scheme = comps.shift(),
		addr = comps.shift();
	switch (scheme) {
		//"file":
		default:
			$.browser.tabSelected = new $.WebView({url: url});
	}
};

delegate.AppFinishedLaunching = function() {
	$.browser.unhideApp();
	$.browser.addShortcut('CopeTube.app/index.html', copetube);
	$.browser.addShortcut('~/src/CopeTube/index.html', copetubeDev);
	$.browser.addShortcut('kfix.tech/CopeTube', copetubeWeb);
	$.browser.addShortcut('github.com/kfix/CopeTube', copetubeGH);
	$.browser.tabSelected = new $.WebView(copetube);
};

delegate; //return this to macpin
