function registerWorker() {
	// Chrome requires a service worker to allow install as a desktop PWA
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('./sw.js').then(function(reg) {
		console.log('Successfully registered service worker', reg);
	}).catch(function(err) {
		console.warn('Error whilst registering service worker', err);
		// this will fail over file:// transport, which is good, because
		//   local use doesn't need offline caching
		});
	}
}

// FIXME check if imported from index.html??
registerWorker();
