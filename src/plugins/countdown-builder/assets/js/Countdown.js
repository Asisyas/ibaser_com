function YcdCountdown() {
	this.init();
	this.options = {};
	this.allOptions = {};
}

YcdCountdown.prototype.setOptions = function(options) {
	this.options = options;
};

YcdCountdown.prototype.getOptions = function() {
	return this.options;
};

YcdCountdown.prototype.setAllOptions = function(allOptions) {
	this.allOptions = allOptions;
};

YcdCountdown.prototype.getAllOptions = function() {
	return this.allOptions;
};

YcdCountdown.prototype.init = function() {
	this.startTimeCircle();
	this.minicolors();
	this.ionRangeSlider();
	this.imageUpload();
	this.livePreview();
};

YcdCountdown.prototype.imageUpload = function() {
	var custom_uploader;
	jQuery('#js-upload-image-button').click(function(e) {
		e.preventDefault();

		/* If the uploader object has already been created, reopen the dialog */
		if (custom_uploader) {
			custom_uploader.open();
			return;
		}
		/* Extend the wp.media object */
		custom_uploader = wp.media.frames.file_frame = wp.media({
			titleFF: 'Choose Image',
			button: {
				text: 'Choose Image'
			},
			multiple: false
		});
		/* When a file is selected, grab the URL and set it as the text field's value */
		custom_uploader.on('select', function() {
			var attachment = custom_uploader.state().get('selection').first().toJSON();
			var imageURL = jQuery('#ycd-bg-image-url');
			imageURL.val(attachment.url);
			imageURL.trigger('change');
		});
		/* Open the uploader dialog */
		custom_uploader.open();
	});

	/* its finish image uploader */
};

YcdCountdown.prototype.ionRangeSlider= function() {

	var that = this;
	var circleWidth = jQuery('#ycd-circle-width');

	if(!circleWidth.length) {
		return false;
	}
	circleWidth.ionRangeSlider({
		hide_min_max: true,
		keyboard: true,
		min: 0.0033333333333333335,
		max: 0.13333333333333333,
		type: 'single',
		step: 0.003333333,
		prefix: '',
		grid: false
	}).change(function() {
		var val = jQuery(this).val();
		that.changeOption('fg_width', val);
		that.build();
	});

	jQuery('#ycd-js-circle-bg-width').ionRangeSlider({
		hide_min_max: true,
		keyboard: true,
		min: 0.1,
		max: 3,
		type: 'single',
		step: 0.1,
		prefix: '',
		grid: false
	}).change(function() {
		var val = jQuery(this).val();
		that.changeOption('bg_width', val);
		that.build();
	});

	jQuery('#ycd-js-circle-start-angle').ionRangeSlider({
		hide_min_max: true,
		keyboard: true,
		min: 0,
		max: 360,
		type: 'single',
		step: 10,
		prefix: '',
		grid: false
	}).change(function() {
		var val = jQuery(this).val();
		that.changeOption('start_angle', val);
		that.build();
	});
};

YcdCountdown.prototype.minicolors = function() {
	var minicolors = jQuery('.js-ycd-time-color');

	if(!minicolors.length) {
		return false;
	}
	var circle = jQuery('.ycd-time-circle');

	minicolors.minicolors({
		change: function() {
			var color = jQuery(this).val();
			var timeName = jQuery(this).data('time-type');
			var options = circle.data('options');
			options.time[timeName].color = color;
			circle.data('options', options);
			circle.TimeCircles(options).rebuild();
		}
	});
};

YcdCountdown.prototype.livePreview = function() {
	this.changeDateType();
	this.chnageDateDuration();
	this.changeDate();
	this.changeTimeZone();
	this.changeCountsAnimation();
	this.changeCountsDirection();
	this.changeBackgroundCircle();
	this.changeDimension();
	this.changeTimesStatus();
	this.changeTimesText();
	this.changeBackgroundImage();
	this.circleBgColor();
	this.changeFontSize();
	this.changeFontWeight();
	this.changeFontStyle();
	this.changeFontFamily();
	this.changeTextColor();
	this.changePadding();
	this.changeAlignment();
	this.changeNumberStyles();

	/* change schedule */
	this.changeScheduleWeekDay();
	this.changeScheduleHour();
	this.changeSchedileTimeZone();
};

YcdCountdown.prototype.changeSchedileTimeZone = function() {
	var timeZone = jQuery('.js-ycd-schedule-time-zone');

	if(!timeZone.length) {
		return false;
	}
	that = this;
	var countdowns = jQuery('.ycd-time-circle');
	timeZone.bind('change', function() {
		var name = jQuery(this).attr('name');
		var val = jQuery('option:selected', this).val();
		var options = countdowns.data('options');
		options[name] = val;
		countdowns.data('options', options);
		countdowns = that.addTimeToClock(options, countdowns);
		jQuery('.ycd-time-circle').TimeCircles().restart();
	});
}

YcdCountdown.prototype.changeScheduleHour = function() {
	var hours = jQuery('.js-datetimepicker-seconds');

	if(!hours.length) {
		return false;
	}	

	var countdowns = jQuery('.ycd-time-circle');
	hours.bind('change', function() {
		var name = jQuery(this).attr('name');
		var val = jQuery(this).val();
		var options = countdowns.data('options');
		options[name] = val;
		countdowns.data('options', options);
		countdowns = that.addTimeToClock(options, countdowns);
		jQuery('.ycd-time-circle').TimeCircles().restart();
	});
}

YcdCountdown.prototype.changeScheduleWeekDay = function() {
	var weekDay = jQuery('.ycd-date-week-day');

	if(!weekDay.length) {
		return false;
	}
	that = this;
	var countdowns = jQuery('.ycd-time-circle');
	weekDay.bind('change', function() {
		var name = jQuery(this).attr('name');
		var val = jQuery('option:selected', this).val();
		var options = countdowns.data('options');
		options[name] = val;
		options[jQuery(this).data('week-number-key')] = YcdCountdownProFunctionality.weekDayNumberFromName(val);
		countdowns.data('options', options);
		countdowns = that.addTimeToClock(options, countdowns);
		jQuery('.ycd-time-circle').TimeCircles().restart();
	})
}

YcdCountdown.prototype.changeDateType = function() {
	var types = jQuery('.ycd-date-type');

	if(!types.length) {
		return false;
	}
	that = this;
	var countdowns = jQuery('.ycd-time-circle');
	types.bind('change', function() {
		var val = jQuery(this).val();
		var timeName = jQuery(this).attr('name');
		var options = countdowns.data('options');
		options[timeName] = val;
		countdowns.data('options', options);
		countdowns = that.addTimeToClock(options, countdowns);
		jQuery('.ycd-time-circle').TimeCircles().restart();
	});
}

YcdCountdown.prototype.chnageDateDuration = function() {
	var types = jQuery('.ycd-timer-time-settings');

	if(!types.length) {
		return false;
	}
	that = this;
	var countdowns = jQuery('.ycd-time-circle');
	types.bind('change', function() {
		var val = jQuery(this).val();
		var timeName = jQuery(this).attr('name');
		var options = countdowns.data('options');
		options[timeName] = val;
		countdowns.data('options', options);
		that.addTimeToClock(options, countdowns);
		jQuery('.ycd-time-circle').TimeCircles().restart();
	});
}

YcdCountdown.prototype.changeAlignment = function() {
	var alignment = jQuery('.ycd-circle-alignment');

	if(!alignment.length) {
		return false;
	}

	alignment.bind('change', function() {
		var align = jQuery('option:selected', this).val();
		jQuery('.ycd-circle-wrapper').css({'text-align': align})
	})
};

YcdCountdown.prototype.changePadding = function() {
	var padding = jQuery('#ycd-countdown-padding');

	if(!padding.length) {
		return false;
	}

	padding.bind('change', function() {
		var padding = jQuery(this).val();
		padding = parseInt(padding) + 'px';
		jQuery('.ycd-time-circle').css({'padding': padding})
	});
};

YcdCountdown.prototype.changeTextColor = function() {
	var textColor = jQuery('.js-ycd-time-text-color');

	if(!textColor.length) {
		return false;
	}

	textColor.minicolors({
		change: function() {
			var color = jQuery(this).val();
			var type = jQuery(this).data('time-type');
			jQuery('.textDiv_'+type+' h4, '+'.textDiv_'+type+' span').css({color: color});
		}
	});
};

YcdCountdown.prototype.changeFontFamily = function() {
	var fonts = jQuery('.js-countdown-font-family');

	if(!fonts.length) {
		return false;
	}
	var that = this;

	fonts.bind('change', function() {
		that.changeTextStyles();
	});
};

YcdCountdown.prototype.changeFontWeight = function() {
	var fontWeight = jQuery('.js-countdown-font-weight');

	if(!fontWeight.length) {
		return false
	}
	var that = this;

	fontWeight.bind('change', function() {
		that.changeTextStyles();
	});
};

YcdCountdown.prototype.changeFontStyle = function() {
	var fontStyle = jQuery('.js-countdown-font-style');

	if(!fontStyle.length) {
		return false
	}
	var that = this;

	fontStyle.bind('change', function() {
		that.changeTextStyles();
	});
};

YcdCountdown.prototype.changeFontSize = function() {
	var fontSize = jQuery('.js-countdown-font-size');

	if(!fontSize) {
		return false;
	}
	var that = this;

	fontSize.bind('change', function() {
		that.changeTextStyles();
	});
};

YcdCountdown.prototype.changeTextStyles = function() {
	var circle = jQuery('.ycd-time-circle');
	var fontSize = jQuery('.js-countdown-font-size').val()+'px';
	var fontWeight = jQuery('.js-countdown-font-weight').val();
	var fontFamily = jQuery('.js-countdown-font-family').val();
	var fontStyle = jQuery('.js-countdown-font-style').val();

	circle.find('h4').each(function() {
		jQuery(this).attr('style',
			'font-size: ' + fontSize+' !important;' +
			'font-weight: ' + fontWeight+' !important;' +
			'font-family:' + fontFamily + '!important;'+
			'font-style:' + fontStyle + '!important'
		);
	})
};

YcdCountdown.prototype.changeNumberStyles = function() {
	var changeNumberTarget = jQuery('.js-countdown-number-size,.js-countdown-number-font-weight, .js-countdown-number-font, .js-countdown-number-font-style');
	var that = this;

	if(!changeNumberTarget.length) {
		return false;
	}
	changeNumberTarget.bind('change', function() {
		that.setNumberStyles();
	});
};

YcdCountdown.prototype.setNumberStyles = function() {
	var circle = jQuery('.ycd-time-circle');
	var fontSize = jQuery('.js-countdown-number-size').val()+'px';
	var fontWeight = jQuery('.js-countdown-number-font-weight').val();
	var fontFamily = jQuery('.js-countdown-number-font').val();
	var fontStyle = jQuery('.js-countdown-number-font-style').val();

	circle.find('span').each(function() {
		jQuery(this).attr('style',
			'font-size: ' + fontSize+' !important;' +
			'font-weight: ' + fontWeight+' !important;' +
			'font-family:' + fontFamily + '!important;'+
			'font-style:' + fontStyle + '!important'
		);
	})
};

YcdCountdown.prototype.circleBgColor = function() {
	var countdownBgCircleColor = jQuery('.js-countdown-bg-circle-color');

	if(!countdownBgCircleColor.length) {
		return false;
	}
	var that = this;

	countdownBgCircleColor.minicolors({
		change: function() {
			var color = jQuery(this).val();
			that.changeOption('circle_bg_color', color);
			that.build();
		}
	});
};

YcdCountdown.prototype.changeBackgroundImage = function() {
	var bgSize = jQuery('.js-ycd-bg-size');

	if(!bgSize.length) {
		return false;
	}
	var circle = jQuery('.ycd-time-circle');
	bgSize.bind('change', function() {
		var val = jQuery(this).val();
		circle.css({'background-size': val});
	});

	jQuery('.js-bg-image-repeat').bind('change', function() {
		var val = jQuery(this).val();
		circle.css({'background-repeat': val});
	});

	jQuery('#ycd-bg-image-url').bind('change', function() {
		var url = jQuery(this).val();
		circle.css('background-image', 'url('+url+')');
	});
};

YcdCountdown.prototype.changeTimesText = function() {
	var times = jQuery('.js-ycd-time-text');
	if(!times) {
		return false;
	}
	var circle = jQuery('.ycd-time-circle');
	times.each(function() {
		jQuery(this).bind('input', function() {
			var val = jQuery(this).val();
			var timeName = jQuery(this).data('time-type');
			var options = circle.data('options');
			options.time[timeName].text = val;
			circle.data('options', options);
			jQuery('.ycd-time-circle').TimeCircles(options).rebuild();
		})
	});
};

YcdCountdown.prototype.changeTimesStatus = function() {
	var times = jQuery('.js-ycd-time-status');
	if(!times) {
		return false;
	}
	var circle = jQuery('.ycd-time-circle');
	times.each(function() {
		jQuery(this).bind('change', function() {
			var status = jQuery(this).is(':checked') ? 'checked' : '';
			var timeName = jQuery(this).data('time-type');
			var options = circle.data('options');
			options.time[timeName].show = status;
			circle.data('options', options);
			circle.TimeCircles(options).rebuild();
		})
	});
};

YcdCountdown.prototype.setCounterTime = function(calendarValue, selectedTimezone) {

	var currentDate = moment(new Date()).tz(selectedTimezone).format('MM/DD/YYYY H:m:s');

	var dateTime = new Date(currentDate).valueOf();
	var timeNow = Math.floor(dateTime / 1000);
	var seconds = Math.floor(new Date(calendarValue).getTime() / 1000) - timeNow;
	if (seconds < 0) {
		seconds = 0;
	}

	return seconds;
};

YcdCountdown.prototype.changeDate = function() {
	var datePicker = jQuery('#ycd-date-time-picker');
	if(!datePicker.length) {
		return false;
	}
	var that = this;

	datePicker.change(function () {
		var val = jQuery(this).val()+':00';
		var selectedTimezone = jQuery('.js-circle-time-zone option:selected').val();
		var seconds = that.setCounterTime(val, selectedTimezone);
		jQuery('.ycd-time-circle').data('timer', seconds).TimeCircles().restart();
	})
};

YcdCountdown.prototype.changeTimeZone = function() {
	var timeZone = jQuery('.js-circle-time-zone');

	if(!timeZone.length) {
		return false;
	}
	var that = this;

	timeZone.bind('change', function() {
		var timeZone = jQuery('option:selected', this).val();
		var date = jQuery('#ycd-date-time-picker').val()+':00';
		var seconds = that.setCounterTime(date, timeZone);
		jQuery('.ycd-time-circle').data('timer', seconds).TimeCircles().restart();
	});
};

YcdCountdown.prototype.changeOption = function(name, value) {
	var circle = jQuery('.ycd-time-circle');
	var options = circle.data('options');
	options[name] = value;
	circle.data('options', options);
};

YcdCountdown.prototype.build = function() {
	var circle = jQuery('.ycd-time-circle');
	var options = circle.data('options');
	circle.TimeCircles(options).rebuild();
};

YcdCountdown.prototype.changeCountsAnimation = function() {
	var animation = jQuery('.js-circle-animation');
	var that = this;

	if(!animation.length) {
		return false;
	}

	animation.bind('change', function() {
		var val = jQuery(this).val();
		that.changeOption('animation', val);
		that.build();
	})
};

YcdCountdown.prototype.changeCountsDirection = function() {
	var direction = jQuery('.js-ycd-direction');
	if(!direction.length) {
		return false;
	}
	var that = this;
	direction.bind('change', function() {
		var val = jQuery(this).val();
		that.changeOption('direction', val);
		that.build();
	})
};

YcdCountdown.prototype.changeBackgroundCircle = function() {
	var backgroundCircle = jQuery('.js-ycd-background-circle');
	if(!backgroundCircle.length) {
		return false;
	}
	var that = this;
	backgroundCircle.bind('change', function() {
		var val = jQuery(this).is(':checked');
		that.changeOption('use_background', val);
		that.build();
	})
};

YcdCountdown.prototype.changeDimension = function() {
	var dimension = jQuery('.js-ycd-dimension');
	if(!dimension.length) {
		return false;
	}
	var that = this;
	dimension.bind('change', function() {
		var number = jQuery('.js-ycd-dimension-number').val();
		number = parseInt(number);
		var measure = jQuery('.js-ycd-dimension-measure').val();
		var width = number+measure;
		jQuery('.ycd-time-circle').css({'width': width});
		that.build();
	});
};

YcdCountdown.prototype.startTimeCircle = function() {
	var that = this;
	var circle = jQuery('.ycd-time-circle');

	if(!circle.length) {
		return false;
	}
	circle.each(function() {
		var options = jQuery(this).attr('data-options');
		var allOptions = jQuery(this).data('all-options');
		options = jQuery.parseJSON(options);
		var endDate = jQuery(this).data('date');

		if(new Date(endDate) - Date.now() <= 0) {
			that.endBehavior(jQuery(this), allOptions)
		}
		that.addTimeToClock(options, jQuery(this));
		that.setOptions(options);
		that.setAllOptions(allOptions);
		that.render(jQuery(this));
	});
};

YcdCountdown.prototype.addTimeToClock = function(options, countDown) {

	if(options['ycd-countdown-date-type'] == 'dueDate') {
		var val = options['ycd-date-time-picker']+':00';
		val = val.replace(/-/g, '/');
		var selectedTimezone = options['ycd-circle-time-zone'];
		var seconds = this.setCounterTime(val, selectedTimezone);
	}
	else if(options['ycd-countdown-date-type'] == 'schedule') {
		var seconds = YcdCountdownProFunctionality.schedule(options);
	}
	else {
		var hours = parseInt(options['ycd-countdown-duration-hours']);
		var minutes = parseInt(options['ycd-countdown-duration-minutes']);
		var secondsSaved = parseInt(options['ycd-countdown-duration-seconds']);

		var seconds = hours*60*60 + minutes*60 + secondsSaved;
	}
	
	countDown.data('timer', seconds);

	return countDown;
};

YcdCountdown.prototype.render = function(currentCountdown) {
	var that = this;
	var options = this.getOptions();
	var allOptions = this.getAllOptions();
	
	if (currentCountdown.data('timer') <= 0) {
		that.endBehavior(currentCountdown, allOptions);
	}
	var countdown = currentCountdown.TimeCircles(options).addListener(countdownComplete);
	function countdownComplete(unit, value, total){

		if(total <= 0){
			that.endBehavior(jQuery(this), allOptions);
		}
	}

	jQuery(window).resize(function() {
		countdown.rebuild();
	});
};

YcdCountdown.prototype.endBehavior = function(countdown, options) {

	if(YcdArgs.isAdmin) {
		return false;
	}
	if (options['ycd-countdown-end-sound']) {
		var soundUrl = options['ycd-countdown-end-sound-url'];
		var song = new Audio (soundUrl);
		song.play();
	}

	var behavior = options['ycd-countdown-expire-behavior'];
	var expireText = options['ycd-expire-text'];
	var expireUrl = options['ycd-expire-url'];
	var countdownWrapper = countdown.parents('.ycd-countdown-wrapper').first();

	switch(behavior) {
		case 'hideCountdown':
			countdownWrapper.hide();
			break;
		case 'showText':
			countdown.fadeOut('slow').replaceWith(expireText);
			break;
		case 'redirectToURL':
			countdownWrapper.fadeOut('slow');
			window.location.href = expireUrl;
			break;
	}
};

jQuery(document).ready(function () {
	new YcdCountdown();
});