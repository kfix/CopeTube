// https://developers.google.com/web/fundamentals/primers/service-workers
//
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
	'/',
	'/vue.js',
	'/styles/demo.css',
	'/styles/fonts.css',
	'/styles/print.css',
	'/styles/MiterTemplate.css',
	'/app/demo.js',
	'/lib/tubes.js',
	'/lib/csscolors.js',
	'/lib/MiterTemplate.js',
	'/lib/JointModel.js',
];

self.addEventListener('install', function(event) {
	// Perform install steps
	event.waitUntil(
	caches.open(CACHE_NAME)
		.then(function(cache) {
 			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
			.then(function(response) {
				// Cache hit - return response
				if (response) {
					return response;
				}
				return fetch(event.request);
			}
		)
	);
});

self.addEventListener('activate', function(event) {
	var cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName) {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
 				})
			);
		})
	);
});
