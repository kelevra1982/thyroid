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

$.noConflict();

jQuery(document).ready(function($)
{
	window.addEventListener('online',  updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);

	$('#app').waitForImages(function()
	{
		$('#spinner').remove();
		$('#app').animate({ opacity: 1 }, 350);
	});

	function updateOnlineStatus(event)
	{
		var condition = navigator.onLine ? 'online' : 'offline';

		ons.notification.toast('<p style="text-align:center;margin:0;">Sie sind jetzt ' + condition + '.</p>', { timeout: 2000, animation: 'fall' });

		if (document.querySelector('#myNavigator').topPage.id == 'ft3' && condition == 'online')
		{
			if (document.querySelector('ons-tabbar').getActiveTabIndex() == 0)
			{
				drawPlot('/api/ft3get.php', 'ft3-tab1-content', 4.1, 2.3, 'ng/l');
			}
		}
		else if (document.querySelector('#myNavigator').topPage.id == 'ft4' && condition == 'online')
		{
			if (document.querySelector('ons-tabbar').getActiveTabIndex() == 0)
			{
				drawPlot('/api/ft4get.php', 'ft4-tab1-content', 1.29, 0.62, 'ng/l');
			}
		}
		else if (document.querySelector('#myNavigator').topPage.id == 'tsh' && condition == 'online')
		{
			if (document.querySelector('ons-tabbar').getActiveTabIndex() == 0)
			{
				drawPlot('/api/tshget.php', 'tsh-tab1-content', 0.4, 4.0, 'mU/l');
			}
		}
		else if (document.querySelector('#myNavigator').topPage.id == 'vitamind' && condition == 'online')
		{
			if (document.querySelector('ons-tabbar').getActiveTabIndex() == 0)
			{
				drawPlot('/api/vitamindget.php', 'vitamind-tab1-content', 30, 20, 'ng/ml');
			}
		}
	}

	function drawPlot(apiTarget, contentTarget, upperLimit, lowerLimit, unit)
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

			$('#' + contentTarget).append('<p class="value-divider">Letzter Wert.</p><p class="value-header ' + arrowClass + '">' + new Date(data[data.length - 1].date).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }) + '<br><span><i class="arrow-' + arrowClass + '"></i>' + data[data.length - 1].before_comma + '.' + data[data.length - 1].after_comma + '</span> ' + unit + '</p><p class="value-divider">Darstellung als Diagramm.</p><div id="chart"></div><div id="table"></div>');

			var line 		=	[];
			var lineupper 	=	[];
			var lineunder 	=	[];
			var table		=	'<p class="value-divider">Darstellung als Tabelle.</p><ons-row vertical-align="center" style="margin-top:1rem;border:1px solid #4a4a4a;"><ons-col style="text-align:center;position:relative;left:-1rem;">Datum</ons-col><ons-col>&nbsp;</ons-col><ons-col style="position:relative;left:-1rem;">Wert in ' + unit + '</ons-col></ons-row>';
			var firstDate	=	data[0].date.split('-');
			var lastDate	=	data[data.length - 1].date.split('-');

			$.each(firstDate, function(index, value)
			{
				firstDate[index] = value.replace(/^0+/, '');
			});

			$.each(lastDate, function(index, value)
			{
				lastDate[index] = value.replace(/^0+/, '');
			});

			firstDate		=	new Date(firstDate[0] + '/' + firstDate[1] + '/' + firstDate[2]);
			firstDate		=	new Date(firstDate.setMonth(firstDate.getMonth() - 1)).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('.');
			firstDate		=	firstDate[2] + '-' + firstDate[1] + '-' + firstDate[0];

			lastDate		=	new Date(lastDate[0] + '/' + lastDate[1] + '/' + lastDate[2]);
			lastDate		=	new Date(lastDate.setMonth(lastDate.getMonth() + 1)).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('.');
			lastDate		=	lastDate[2] + '-' + lastDate[1] + '-' + lastDate[0];

			lineupper.push([firstDate, upperLimit]);
			lineunder.push([firstDate, lowerLimit]);


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

			lineupper.push([lastDate, upperLimit]);
			lineunder.push([lastDate, lowerLimit]);

			var plot = $.jqplot('chart', [lineupper, lineunder, line],
			{
				title			:	'',
				seriesDefaults	:	{
          								rendererOptions	:
										{
              								smooth		:	true,
          								}
      								},
				axes			:	{
										xaxis		:	{
															renderer	:	$.jqplot.DateAxisRenderer,
															tickOptions	:	{
																				formatString	:	'%d.%m.%Y',
																				showGridline	:	true,
																				textColor		:	'#1f1f21',
																			},
															min			:	firstDate,
				    										max			:	lastDate,
														},
										yaxis		:	{
				          									tickOptions	:	{
				            													formatString	:	'%.2f ' + unit,
																				showGridline	:	true,
																				textColor		:	'#1f1f21',
				            												}
				        								}
									},
				highlighter		:	{
        								show				: 	true,
        								sizeAdjust			: 	7.5,
										tooltipLocation		:	'n',
										tooltipAxes			:	'both',
      								},
				fillBetween		:	{
										series1				:	0,
										series2				:	1,
										color				:	'rgba(58, 219, 118, 0.7)',
										baseSeries			:	0,
										fill				:	true,
									},
				series			:	[
										{
											lineWidth		:	0,
											color			:	'rgba(58, 219, 118, 0.7)',
											markerOptions	:	{
																	size	:	0,
																	style	:	'filledSquare',
																}
										},
										{
											lineWidth		:	0,
											color			:	'rgba(58, 219, 118, 0.7)',
											markerOptions	:	{
																	size	:	0,
																	style	:	'filledSquare',
																}
										},
										{
											lineWidth		:	2,
											color			:	'rgba(254, 254, 254, 1)',
											showLine		:	true,
											linePattern		:	'dotted',
											markerOptions	:	{
																	size	:	10,
																	style	:	'x',
																}
										}
									],
				grid			:	{
										background			:	'rgba(204, 75, 55, 0.8)',
					        			borderColor			:	'rgba(204, 75, 55, 0.8)',
										gridLineColor		:	'rgba(254, 254, 254, 0.3)',
					        			borderWidth			:	0.0,
					        			shadow				:	false,
									},
			});

			$('.jqplot-series-shadowCanvas').css('width', $('.jqplot-series-shadowCanvas').width() + 1);

			$(window).on('resize', function(event)
			{
				plot.destroy();
				plot.replot();
				$('.jqplot-series-shadowCanvas').css('width', $('.jqplot-series-shadowCanvas').width() + 1);
			});

			$('#table').html(table);

		}).fail(function(err)
		{
			$('.spinner').hide();
			ons.notification.toast('<p style="text-align:center;margin:0;">Fehler beim Laden der Daten.</p>', { timeout: 2000, animation: 'fall' });
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

		if (value == '0,0')
		{
			ons.notification.toast('<p style="text-align:center;margin:0;">Der Wert darf nicht 0 sein.</p>', { timeout: 2000, animation: 'fall' });
			$('.spinner').hide();
			return false;
		}

		$.post(apiTarget, { value : value, date : $('#' + formDateValue).val() }, function(data)
		{
			if (data == 'false')
			{
				$('.spinner').hide();
				ons.notification.toast('<p style="text-align:center;margin:0;">Fehler beim Speichern der Daten.</p>', { timeout: 2000, animation: 'fall' });
			}
			else
			{
				$('#' + formValue).val('0,0');
				resetDate(formDateValue);
				$('.spinner').hide();
				ons.notification.toast('<p style="text-align:center;margin:0;">Daten erfolgreich gespeichert.</p>', { timeout: 2000, animation: 'fall' });
			}
		}).fail(function(err)
		{
			$('.spinner').hide();
			ons.notification.toast('<p style="text-align:center;margin:0;">Fehler beim Speichern der Daten.</p>', { timeout: 2000, animation: 'fall' });
		});
	}

	function builtShareHandler(target, label)
	{
		html2canvas(document.getElementById(target)).then(function(canvas)
		{
			var anchor = document.createElement('a');
			anchor.setAttribute('href', canvas.toDataURL('image/png'));
			anchor.setAttribute('download', label + '-' + new Date().toJSON().slice(0, 10).replace(/-/g, '-') + '.png');
			anchor.click();
		});
	}

	function handleCheckBox(data, target)
	{
		if (data == '1')
		{
			$('#' + target).prop('checked', true);
		}
		else
		{
			$('#' + target).prop('checked', false);
		}
	}

	function isCheckboxChecked(target)
	{
		if ($('#' + target).is(':checked'))
		{
			return 1;
		}
		else
		{
			return 0;
		}
	}

	document.addEventListener('init', function(event)
	{
		if (event.target.id === 'ft3')
		{
			drawPlot('/api/ft3get.php', 'ft3-tab1-content', 4.1, 2.3, 'ng/l');
		}
		else if (event.target.id === 'ft4')
		{
			drawPlot('/api/ft4get.php', 'ft4-tab1-content', 1.29, 0.62, 'ng/l');
		}
		else if (event.target.id == 'tsh')
		{
			drawPlot('/api/tshget.php', 'tsh-tab1-content', 0.4, 4.0, 'mU/l');
		}
		else if (event.target.id == 'vitamind')
		{
			drawPlot('/api/vitamindget.php', 'vitamind-tab1-content', 30, 20, 'ng/ml');
		}
		else if (event.target.id == 'beschwerden')
		{
			$('.spinner').show();

			$.getJSON('/api/beschwerdenget.php', {date:new Date().toJSON().slice(0, 10).replace(/-/g, '-')}, function(data)
			{
				if (data.length != 0)
				{
					$('#beschwerden-tab1-content').empty();

					if (data[0].symptom1 == '1')
					{
						$('#beschwerden-tab1-content').append('<p>Schlafstörungen</p>');
					}
					if (data[0].symptom2 == '1')
					{
						$('#beschwerden-tab1-content').append('<p>Schwitzen</p>');
					}
					if (data[0].symptom3 == '1')
					{
						$('#beschwerden-tab1-content').append('<p>Zittern</p>');
					}
					if (data[0].symptom4 == '1')
					{
						$('#beschwerden-tab1-content').append('<p>schnell zu warm</p>');
					}

					$('.spinner').hide();
				}
			}).fail(function(err)
			{	$('.spinner').hide();
				console.log(err);
			});
		}
	}, false);

	document.addEventListener('prechange', function(event)
	{
		$('.spinner').hide();

		if (event.tabItem.id === 'ft3-tab1-link')
		{
			$('#ft3-reload').show();
			$('#ft3-share').show();
			drawPlot('/api/ft3get.php', 'ft3-tab1-content', 4.1, 2.3, 'ng/l');
		}
		else if (event.tabItem.id === 'ft3-tab2-link')
		{
			$('#ft3-reload').hide();
			$('#ft3-share').hide();
			resetDate('ft3-form-date');
		}
		else if (event.tabItem.id === 'ft4-tab1-link')
		{
			$('#ft4-reload').show();
			$('#ft4-share').show();
			drawPlot('/api/ft4get.php', 'ft4-tab1-content', 1.29, 0.62, 'ng/l');
		}
		else if (event.tabItem.id === 'ft4-tab2-link')
		{
			$('#ft4-reload').hide();
			$('#ft4-share').hide();
			resetDate('ft4-form-date');
		}
		else if (event.tabItem.id === 'tsh-tab1-link')
		{
			$('#tsh-reload').show();
			$('#tsh-share').show();
			drawPlot('/api/tshget.php', 'tsh-tab1-content', 0.4, 4.0, 'mU/l');
		}
		else if (event.tabItem.id === 'tsh-tab2-link')
		{
			$('#tsh-reload').hide();
			$('#tsh-share').hide();
			resetDate('tsh-form-date');
		}
		else if (event.tabItem.id === 'vitamind-tab1-link')
		{
			$('#vitamind-reload').show();
			$('#vitamind-share').show();
			drawPlot('/api/vitamindget.php', 'vitamind-tab1-content', 30, 20, 'ng/ml');
		}
		else if (event.tabItem.id === 'vitamind-tab2-link')
		{
			$('#vitamind-reload').hide();
			$('#vitamind-share').hide();
			resetDate('vitamind-form-date');
		}
		else if (event.tabItem.id === 'beschwerden-tab1-link')
		{
			$('.spinner').show();
			$('#beschwerden-reload').show();
			$('#beschwerden-share').show();

			$.getJSON('/api/beschwerdenget.php', {date:new Date().toJSON().slice(0, 10).replace(/-/g, '-')}, function(data)
			{
				if (data.length != 0)
				{
					$('#beschwerden-tab1-content').empty();

					if (data[0].symptom1 == '1')
					{
						$('#beschwerden-tab1-content').append('<p>Schlafstörungen</p>');
					}
					if (data[0].symptom2 == '1')
					{
						$('#beschwerden-tab1-content').append('<p>Schwitzen</p>');
					}
					if (data[0].symptom3 == '1')
					{
						$('#beschwerden-tab1-content').append('<p>Zittern</p>');
					}
					if (data[0].symptom4 == '1')
					{
						$('#beschwerden-tab1-content').append('<p>schnell zu warm</p>');
					}

					$('.spinner').hide();
				}
			}).fail(function(err)
			{	$('.spinner').hide();
				console.log(err);
			});
		}
		else if (event.tabItem.id === 'beschwerden-tab2-link')
		{
			$('#beschwerden-reload').show();
			$('#beschwerden-share').show();
		}
		else if (event.tabItem.id === 'beschwerden-tab3-link')
		{
			$('#beschwerden-reload').hide();
			$('#beschwerden-share').hide();
			resetDate('beschwerden-form-date');

			$.getJSON('/api/beschwerdenget.php', {date:$('#beschwerden-form-date').val()}, function(data)
			{
				if (data.length != 0)
				{
					handleCheckBox(data[0].symptom1, 'symptom1');
					handleCheckBox(data[0].symptom2, 'symptom2');
					handleCheckBox(data[0].symptom3, 'symptom3');
					handleCheckBox(data[0].symptom4, 'symptom4');
				}
			}).fail(function(err)
			{
				console.log(err);
			});
		}
	}, false);

	$(document).on('click', '#ft3-reload',function()
	{
		drawPlot('/api/ft3get.php', 'ft3-tab1-content', 4.1, 2.3, 'ng/l');
	});

	$(document).on('click', '#ft4-reload',function()
	{
		drawPlot('/api/ft4get.php', 'ft4-tab1-content', 1.29, 0.62, 'ng/l');
	});

	$(document).on('click', '#tsh-reload',function()
	{
		drawPlot('/api/tshget.php', 'tsh-tab1-content', 0.4, 4.0, 'mU/l');
	});

	$(document).on('click', '#vitamind-reload',function()
	{
		drawPlot('/api/vitamindget.php', 'vitamind-tab1-content', 30, 20, 'ng/ml');
	});

	$(document).on('click', '#ft3-form-save',function()
	{
		builtSaveHandler('ft3-form-value', '/api/ft3post.php', 'ft3-form-date');
	});

	$(document).on('click', '#ft4-form-save',function()
	{
		builtSaveHandler('ft4-form-value', '/api/ft4post.php', 'ft4-form-date');
	});

	$(document).on('click', '#tsh-form-save',function()
	{
		builtSaveHandler('tsh-form-value', '/api/tshpost.php', 'tsh-form-date');
	});

	$(document).on('click', '#vitamind-form-save',function()
	{
		builtSaveHandler('vitamind-form-value', '/api/vitamindpost.php', 'vitamind-form-date');
	});

	$(document).on('click', '#beschwerden-form-save',function()
	{
		let data		=	{};
		data.date		=	$('#beschwerden-form-date').val();
		data.symptom1	=	isCheckboxChecked('symptom1');
		data.symptom2	=	isCheckboxChecked('symptom2');
		data.symptom3	=	isCheckboxChecked('symptom3');
		data.symptom4	= 	isCheckboxChecked('symptom4');

		$.post('/api/beschwerdenpost.php', data, function(data)
		{
			console.log(data);
		}).fail(function(err)
		{
			console.log(err);
		});
	});

	$(document).on('focus', '#ft3-form-value', function()
	{
		if ($('#ft3-form-value').val() == '0,0')
		{
			$('#ft3-form-value').val('');
		}
	});

	$(document).on('blur', '#ft3-form-value', function()
	{
		if ($('#ft3-form-value').val() == '')
		{
			$('#ft3-form-value').val('0,0');
		}
	});

	$(document).on('focus', '#ft4-form-value', function()
	{
		if ($('#ft4-form-value').val() == '0,0')
		{
			$('#ft4-form-value').val('');
		}
	});

	$(document).on('blur', '#ft4-form-value', function()
	{
		if ($('#ft4-form-value').val() == '')
		{
			$('#ft4-form-value').val('0,0');
		}
	});

	$(document).on('focus', '#tsh-form-value', function()
	{
		if ($('#tsh-form-value').val() == '0,0')
		{
			$('#tsh-form-value').val('');
		}
	});

	$(document).on('blur', '#tsh-form-value', function()
	{
		if ($('#tsh-form-value').val() == '')
		{
			$('#tsh-form-value').val('0,0');
		}
	});

	$(document).on('focus', '#vitamind-form-value', function()
	{
		if ($('#vitamind-form-value').val() == '0,0')
		{
			$('#vitamind-form-value').val('');
		}
	});

	$(document).on('blur', '#vitamind-form-value', function()
	{
		if ($('#vitamind-form-value').val() == '')
		{
			$('#vitamind-form-value').val('0,0');
		}
	});

	$(document).on('click', '#ft3-share', function()
	{
		builtShareHandler('ft3-tab1-content', 'Thyroid-FT3-Werte');
	});

	$(document).on('click', '#ft4-share', function()
	{
		builtShareHandler('ft4-tab1-content', 'Thyroid-FT4-Werte');
	});

	$(document).on('click', '#tsh-share', function()
	{
		builtShareHandler('tsh-tab1-content', 'Thyroid-TSH-Werte');
	});

	$(document).on('click', '#vitamind-share', function()
	{
		builtShareHandler('vitamind-tab1-content', 'Thyroid-Vitamin-D-Werte');
	});

	$(document).on('click', '#app-menu', function()
	{
		document.getElementById('app-menu').open();
	});
});
