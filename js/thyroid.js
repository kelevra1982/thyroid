if ('serviceWorker' in navigator)
{
	navigator.serviceWorker.register('/sw.js').then(registration =>
	{
		if (registration.active)
		{
			registration.addEventListener('updatefound', () =>
			{
				const installingWorker = registration.installing;

				installingWorker.addEventListener('statechange', () =>
				{
					if (installingWorker.state === 'installed')
					{
						onUpdateFound();
					}
				});
			});
		}
	}).catch(e => console.log(e));
}

function onUpdateFound()
{
	ons.openActionSheet(
	{
		title 		:	'Es ist ein Update verfügbar. Möchten Sie es installieren?',
		cancelable	:	true,
		buttons		:	[
							'Installieren',
							{
								label 	:	'Abbrechen',
								icon	:	'md-close'
							}
						]
	}).then(function (index)
	{
		if (index === 0)
		{
			location.reload();
		}
	});
}

if (ons.platform.isIPhoneX())
{
	document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
}

if (ons.platform.isIPhoneX())
{
	document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
}

function loadPage(page)
{
	document.querySelector('#myNavigator').pushPage(page);
}

window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus(event)
{
	var condition = navigator.onLine ? 'online' : 'offline';

	ons.notification.toast('<p style="text-align:center;margin:0;">Sie sind jetzt ' + condition + '.</p>', { timeout: 2000 });
}

$.noConflict();

jQuery(document).ready(function($)
{
	document.addEventListener('init', function(event)
	{
		if (event.target.id === 'ft3')
		{
			$.getJSON('/api/ft3get.php', function(data)
			{
				$.each(data, function(index, value)
				{
					$('#ft3-tab1-content').append('<p id="text' + index + '">' + value.text + '</p>');

					if (index == (data.length - 1))
					{
						$('.spinner').hide();
					}
				});
			}).fail(function(err)
			{
				console.log(err);
			});
		}

		if (event.target.id === 'ft4')
		{

		}
	});

	document.addEventListener('prechange', function(event)
	{
  		if (event.tabItem.id === 'ft3-tab1-link')
		{
			$('#ft3-tab1-content').empty();
			$('.spinner').show();

			$.getJSON('/api/ft3get.php', function(data)
			{
				$.each(data, function(index, value)
				{
					$('#ft3-tab1-content').append('<p id="text' + index + '">' + value.text + '</p>');

					if (index == (data.length - 1))
					{
						$('.spinner').hide();
					}
				});
			}).fail(function(err)
			{
				console.log(err);
			});
		}
	});

	$(document).on('click', '#ft3-form-save',function()
	{
		$.post('/api/ft3post.php', { text:$('#ft3-form-value').val() }, function(data)
		{
			$('#ft3-form-value').val('');
		}).fail(function(err)
		{
			console.log(err);
		});
	});
});
