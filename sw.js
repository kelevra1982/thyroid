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
			'https://unpkg.com/onsenui/css/material-design-iconic-font/css/material-design-iconic-font.min.css',
			'https://unpkg.com/browse/onsenui/css/material-design-iconic-font/fonts/Material-Design-Iconic-Font.eot',
			'https://unpkg.com/browse/onsenui/css/material-design-iconic-font/fonts/Material-Design-Iconic-Font.svg',
			'https://unpkg.com/browse/onsenui/css/material-design-iconic-font/fonts/Material-Design-Iconic-Font.ttf',
			'https://unpkg.com/browse/onsenui/css/material-design-iconic-font/fonts/Material-Design-Iconic-Font.woff',
			'https://unpkg.com/browse/onsenui/css/material-design-iconic-font/fonts/Material-Design-Iconic-Font.woff2',
			'https://fonts.googleapis.com/css2?family=Oleo+Script:wght@400;700&display=swap',
			'/css/thyroid.css',
			'https://unpkg.com/onsenui/js/onsenui.min.js',
			'https://unpkg.com/jquery/dist/jquery.min.js',
			'https://cdnjs.cloudflare.com/ajax/libs/inobounce/0.2.0/inobounce.js',
			'/js/thyroid.js',
			'/img/header.png',
			'/img/ft3.png',
			'/img/ft4.png',
			'/img/tsh.png',
			'/img/vitamind.png',
			'/img/beschwerden.png',
			'/img/medikation.png',
			'/img/statistik.png',
			'/img/date.png',
			'/splashscreens/iphonex_splash.png',
			'/splashscreens/iphonexr_splash.png',
			'/splashscreens/iphonexsmax_splash.png'
		]);
	}));
});

self.addEventListener('fetch', function(e)
{
	e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)));
});

// last Update: 09.04.2020 11:43
