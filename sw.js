// VERSION: 0.1
self.addEventListener('install', function(e)
{
	e.waitUntil(caches.open('thyroid').then(cache =>
	{
		return cache.addAll([
			'/',
			'/index.html',
			'/manifest.json',
			'https://unpkg.com/onsenui/css/onsenui.min.css',
			'https://unpkg.com/onsenui/css/onsen-css-components.min.css',
			'https://fonts.googleapis.com/css2?family=Oleo+Script:wght@400;700&display=swap',
			'/css/thyroid.css',
			'https://unpkg.com/onsenui/js/onsenui.min.js',
			'https://unpkg.com/jquery/dist/jquery.min.js',
			'/js/thyroid.js'
		]);
	}));
});

self.addEventListener('fetch', function(e)
{
	e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)));
});

// last Update: 06.04.2020 20:13
