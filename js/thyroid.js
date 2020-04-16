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
	function drawPlot(apiTarget, contentTarget, upperLimit, lowerLimit)
	{
		$(window).off('resize');
		$('#' + contentTarget).empty();
		$('.spinner').show();

		$.getJSON(apiTarget, function(data)
		{
			if (data.length == 0)
			{
				$('.spinner').hide();
				return false;
			}
			else if (data.length == 1)
			{
				var arrowClass		=	'none';
			}
			else
			{
				var lastValue		=	parseFloat(data[data.length - 1].before_comma + '.' + data[data.length - 1].after_comma);
				var beforeLastValue	=	parseFloat(data[data.length - 2].before_comma + '.' + data[data.length - 2].after_comma);
				var arrowClass		=	(lastValue > beforeLastValue) ? 'up' : (lastValue == beforeLastValue) ? 'none' : 'down';
			}

			$('#' + contentTarget).append('<p class="value-header">' + new Date(data[data.length - 1].date).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }) + '<br><span><i class="arrow-' + arrowClass + '"></i>' + data[data.length - 1].before_comma + '.' + data[data.length - 1].after_comma + '</span> ng/l</p><p class="value-divider">Darstellung als Diagramm.</p><div id="chart"></div><div id="table"></div>');

			var line 		=	[];
			var lineupper 	=	[];
			var lineunder 	=	[];
			var table		=	'<p class="value-divider">Darstellung als Tabelle.</p><ons-row vertical-align="center" style="margin-top:1rem;border:1px solid #4a4a4a;"><ons-col style="text-align:center;position:relative;left:-1rem;">Datum</ons-col><ons-col>&nbsp;</ons-col><ons-col style="position:relative;left:-1rem;">Wert in ng/l</ons-col></ons-row>';

			$.each(data, function(index, value)
			{
				var mydate	=	new Date(value.date).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
				table		=	table + '<ons-row vertical-align="center" style="border-bottom:1px solid #4a4a4a;border-left:1px solid #4a4a4a;border-right:1px solid #4a4a4a;"><ons-col style="text-align:center;">' + mydate + '</ons-col><ons-col style="text-align:right;">' + value.before_comma + '.</ons-col><ons-col style="text-align:left;">' + value.after_comma + '</ons-col></ons-row>';

				line.push([value.date, parseFloat(value.before_comma + '.' + value.after_comma)]);
				lineupper.push([value.date, upperLimit]);
				lineunder.push([value.date, lowerLimit]);

				if (index == (data.length - 1))
				{
					$('.spinner').hide();
				}
			});

			var plot = $.jqplot('chart', [lineupper, lineunder, line],
			{
				title			:	'',
				axes			:	{
										xaxis		:	{
															renderer	:	$.jqplot.DateAxisRenderer,
															tickOptions	:	{
																				formatString	:	'%d.%m.%Y',
																			},
														},
										yaxis		:	{
				          									tickOptions	:	{
				            													formatString	:	'%.2f ng/l',
				            												}
				        								}
									},
				highlighter		:	{
        								show				: 	true,
        								sizeAdjust			: 	7.5,
										tooltipLocation		: 'n',
										tooltipAxes			: 'both'
      								},
				fillBetween		:
									{
										series1				:	0,
										series2				:	1,
										color				:	'rgba(58, 219, 118, 0.7)',
										baseSeries			:	0,
										fill				:	true
									},
				series			:	[
										{
											lineWidth		:	1,
											color			:	'#3adb76',
											markerOptions	:	{
																	size	:	0,
																	style	:	'filledSquare'
																}
										},
										{
											lineWidth		:	1,
											color			:	'#3adb76',
											markerOptions	:	{
																	size	:	0,
																	style	:	'filledSquare'
																}
										},
										{
											lineWidth		:	1,
											color			:	'#a4a4a4',
											markerOptions	:	{
																	style	:	'filledSquare'
																}
										}
									]
			});

			$(window).on('resize', function(event)
			{
				plot.destroy();
				plot.replot();
			});

			$('#table').html(table);

		}).fail(function(err)
		{
			$('.spinner').hide();
			ons.notification.toast('<p style="text-align:center;margin:0;">Fehler beim Laden der Daten.</p>', { timeout: 2000 });
		});
	}

	function resetDate(contentTarget)
	{
		$('#' + contentTarget).val(new Date().toJSON().slice(0, 10).replace(/-/g, '-'));
	}

	function builtSaveHandler(formValue, apiTarget, formDateValue)
	{
		$('.spinner').show();

		var value = $('#' + formValue).val();

		if (value.indexOf(',') == -1)
		{
			value = value + ',0';
		}

		$.post(apiTarget, { value : value, date : $('#' + formDateValue).val() }, function(data)
		{
			if (data == 'false')
			{
				$('.spinner').hide();
				ons.notification.toast('<p style="text-align:center;margin:0;">Fehler beim Speichern der Daten.</p>', { timeout: 2000 });
			}
			else
			{
				$('#' + formValue).val('0,0');
				resetDate(formDateValue);
				$('.spinner').hide();
				ons.notification.toast('<p style="text-align:center;margin:0;">Daten erfolgreich gespeichert.</p>', { timeout: 2000 });
			}
		}).fail(function(err)
		{
			$('.spinner').hide();
			ons.notification.toast('<p style="text-align:center;margin:0;">Fehler beim Speichern der Daten.</p>', { timeout: 2000 });
		});
	}

	document.addEventListener('init', function(event)
	{
		if (event.target.id === 'ft3')
		{
			drawPlot('/api/ft3get.php', 'ft3-tab1-content', 4.1, 2.3);
		}
		else if (event.target.id === 'ft4')
		{
			drawPlot('/api/ft4get.php', 'ft4-tab1-content', 1.29, 0.62);
		}
	}, false);

	document.addEventListener('prechange', function(event)
	{
		$('.spinner').hide();

		if (event.tabItem.id === 'ft3-tab1-link')
		{
			drawPlot('/api/ft3get.php', 'ft3-tab1-content', 4.1, 2.3);
		}
		else if (event.tabItem.id === 'ft3-tab2-link')
		{
			resetDate('ft3-form-date');
		}
		else if (event.tabItem.id === 'ft4-tab1-link')
		{
			drawPlot('/api/ft4get.php', 'ft4-tab1-content', 1.29, 0.62);
		}
		else if (event.tabItem.id === 'ft4-tab2-link')
		{
			resetDate('ft4-form-date');
		}
	}, false);

	$(document).on('click', '#ft3-form-save',function()
	{
		builtSaveHandler('ft3-form-value', '/api/ft3post.php', 'ft3-form-date');
	});

	$(document).on('click', '#ft4-form-save',function()
	{
		builtSaveHandler('ft4-form-value', '/api/ft4post.php', 'ft4-form-date');
	});
});
