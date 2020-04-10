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
								label 		:	'Abbrechen',
								modifier	:	'destructive'
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
			$('.spinner').show();

			$.getJSON('/api/ft3get.php', function(data)
			{
				$('#ft3-tab1-content').append('<div id="chart1"></div>');
				var line = [];

				$.each(data, function(index, value)
				{
					line.push([value.date, parseFloat(value.before_comma + '.' + value.after_comma)]);

					if (index == (data.length - 1))
					{
						$('.spinner').hide();
					}
				});

				var plot1 = $.jqplot('chart1', [line],
				{
					title			:	'',
					axes			:	{
											xaxis		:	{
																renderer	:	$.jqplot.DateAxisRenderer,
																tickOptions	:	{
																					formatString:'%d.%m.%Y'
																				},
																			}
					},
					series			:	[{
											lineWidth		:	2,
											color			:	'#a4a4a4',
											markerOptions	:	{
																	style	:	'x'
																}
										}]
			   });
			}).fail(function(err)
			{
				$('.spinner').hide();
				ons.notification.toast('<p style="text-align:center;margin:0;">Fehler beim Laden der Daten.</p>', { timeout: 2000 });
			});
		}

		if (event.target.id === 'ft4')
		{

		}
	}, false);

	document.addEventListener('show', function(event)
	{

	}, false);

	document.addEventListener('hide', function(event)
	{

	}, false);

	document.addEventListener('destroy', function(event)
	{

	}, false);

	document.addEventListener('prechange', function(event)
	{
  		if (event.tabItem.id === 'ft3-tab1-link')
		{
			$('#ft3-tab1-content').empty();
			$('.spinner').show();

			$.getJSON('/api/ft3get.php', function(data)
			{
				$('#ft3-tab1-content').append('<div id="chart1"></div>');
				var line = [];

				$.each(data, function(index, value)
				{
					line.push([value.date, parseFloat(value.before_comma + '.' + value.after_comma)]);

					if (index == (data.length - 1))
					{
						$('.spinner').hide();
					}
				});

				var plot1 = $.jqplot('chart1', [line],
				{
					seriesColors	: ['#85802b'],
					title			:	'',
					axes			:	{
											xaxis		:	{
																renderer	:	$.jqplot.DateAxisRenderer,
																tickOptions	:	{
																					formatString:'%d.%m.%Y'
																				},
																			}
					},
					series			:	[{
											lineWidth		:	2,
											color			:	'#a4a4a4',
											markerOptions	:	{
																	style	:	'x'
																}
										}]
			   });
			}).fail(function(err)
			{
				$('.spinner').hide();
				ons.notification.toast('<p style="text-align:center;margin:0;">Fehler beim Laden der Daten.</p>', { timeout: 2000 });
			});
		}

		if (event.tabItem.id === 'ft3-tab2-link')
		{
			$('#ft3-form-date').val(new Date().toJSON().slice(0,10).replace(/-/g,'-'));
		}
	}, false);

	$(document).on('click', '#ft3-form-save',function()
	{
		$('.spinner').show();

		$.post('/api/ft3post.php', { value : $('#ft3-form-value').val(), date : $('#ft3-form-date').val() }, function(data)
		{
			if (data == 'false')
			{
				$('.spinner').hide();
				ons.notification.toast('<p style="text-align:center;margin:0;">Fehler beim Speichern der Daten.</p>', { timeout: 2000 });
			}
			else
			{
				$('#ft3-form-value').val('0,0');
				$('#ft3-form-date').val(new Date().toJSON().slice(0,10).replace(/-/g,'-'));
				$('.spinner').hide();
				ons.notification.toast('<p style="text-align:center;margin:0;">Daten erfolgreich gespeichert.</p>', { timeout: 2000 });
			}
		}).fail(function(err)
		{
			$('.spinner').hide();
			ons.notification.toast('<p style="text-align:center;margin:0;">Fehler beim Speichern der Daten.</p>', { timeout: 2000 });
		});
	});
});
