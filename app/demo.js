function demo(el) {
    return System.import('lib/main.js').then(function(main) {
		main.showDemo(el);
	}).catch(function(e){
		setTimeout(function() { throw e.stack || e; }); // propagate error to console
		return e;
	});
}
