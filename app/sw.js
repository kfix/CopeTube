// https://developers.google.com/web/fundamentals/primers/service-workers
//
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
	'/CopeTube/',
	'/CopeTube/vue.js',
	'/CopeTube/css/demo.css',
	'/CopeTube/css/fonts.css',
	'/CopeTube/css/print.css',
	'/CopeTube/css/MiterTemplate.css',
	'/CopeTube/app/demo.js',
	'/CopeTube/lib/tubes.js',
	'/CopeTube/lib/csscolors.js',
	'/CopeTube/lib/MiterTemplate.js',
	'/CopeTube/lib/JointModel.js',
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
