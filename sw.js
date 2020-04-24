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
			'https://unpkg.com/onsenui/css/dark-onsen-css-components.min.css',
			'https://fonts.googleapis.com/css2?family=Oleo+Script:wght@400;700&display=swap',
			'/css/jquery.jqplot.min.css',
			'/css/thyroid.css',
			'/css/dark-thyroid.css',
			'https://unpkg.com/onsenui/js/onsenui.min.js',
			'https://unpkg.com/jquery/dist/jquery.min.js',
			'https://cdnjs.cloudflare.com/ajax/libs/inobounce/0.2.0/inobounce.js',
			'/js/jquery.jqplot.min.js',
			'/js/jqplot.dateAxisRenderer.js',
			'/js/jqplot.highlighter.js',
			'/js/html2canvas.js',
			'/js/thyroid.js',
			'/img/header.png',
			'/img/ft3.png',
			'/img/ft4.png',
			'/img/tsh.png',
			'/img/menu.png',
			'/img/menu_dark.png',
			'/img/vitamind.png',
			'/img/beschwerden.png',
			'/img/medikation.png',
			'/img/statistik.png',
			'/img/date.png',
			'/img/date_ft4.png',
			'/img/date_tsh.png',
			'/img/date_vitamind.png',
			'/img/share.png',
			'/img/share_dark.png',
			'/splashscreens/iphonex_splash.png',
			'/splashscreens/iphonexr_splash.png',
			'/splashscreens/iphonexsmax_splash.png',
			'/img/plus_blue.png',
			'/img/plus_dark.png',
			'/img/plus_grey.png',
			'/img/time_blue.png',
			'/img/time_dark.png',
			'/img/time_grey.png',
			'/img/reload.png',
			'/img/dark-reload.png',
			'/img/apple-touch-icon-60x60.png',
			'/img/email.png'
		]);
	}));
});

self.addEventListener('fetch', function(e)
{
	e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)));
});

// last Update: 24.04.2020 16:29
