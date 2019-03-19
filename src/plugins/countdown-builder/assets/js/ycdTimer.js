function YcdTimer() {
	this.ycdAudio = false;
}

YcdTimer.prototype.setAlarm = function() {
	var options = this.getSettings();
	if (options['ycd-countdown-end-sound']) {
		var soundUrl = options['ycd-countdown-end-sound-url'];
		var ycdAudio = new Audio (soundUrl);
		this.ycdAudio = ycdAudio;
	}
};

YcdTimer.prototype.init = function() {
	this.livePreview();
	var settings = this.getSettings();
	this.setAlarm();

	this.remainingTime = 0;
	this.countdownHandle = 0;

	this.stopTimer();

	this.gHours = settings['hours'];
	this.gMinutes = settings['minutes'];
	this.gSeconds = settings['seconds'];

	this.resetTimer();
	this.startTimer();

	jQuery('#shortButton').removeClass('btn-success');
	jQuery('#longButton').removeClass('btn-success');
	jQuery('#pomodoroButton').addClass('btn-success');
};

YcdTimer.prototype.setSettings = function(settings) {
	this.settings = settings;
};

YcdTimer.prototype.getSettings = function() {
	return this.settings;
};

YcdTimer.prototype.setId = function(id) {
	this.id = id;
};

YcdTimer.prototype.getId = function() {
	return this.id;
};

function onShortTimer() {
	stopTimer();

	gHours = 0;
	gMinutes = 5;
	gSeconds = 0;

	resetTimer();

	jQuery('#pomodoroButton').removeClass('btn-success');
	jQuery('#longButton').removeClass('btn-success');
	jQuery('#shortButton').addClass('btn-success');
}

function onLongTimer() {
	stopTimer();

	gHours = 0;
	gMinutes = 15;
	gSeconds = 0;

	resetTimer();

	jQuery('#pomodoroButton').removeClass('btn-success');
	jQuery('#shortButton').removeClass('btn-success');
	jQuery('#longButton').addClass('btn-success');
}

function onStartTimer() {
	var timers = window.YcdTimersInstance;
	timers[timers.length-1].stopTimer();
	timers[timers.length-1].startTimer();
};

YcdTimer.prototype.onStopTimer = function() {
	this.stopTimer();
};

function onResetTimer() {
	var timers = window.YcdTimersInstance;
	timers[timers.length-1].stopTimer();
	timers[timers.length-1].resetTimer();
}

stopTimer = function() {
	var timers = window.YcdTimersInstance;
	timers[timers.length-1].onStopTimer();
};

YcdTimer.prototype.startAlarm = function() {
	if(this.emainingTime < 1000) {
		this.endBehavior();
	}
};

YcdTimer.prototype.endBehavior = function() {

	if(YcdArgs.isAdmin) {
		return false;
	}
	var options = this.getSettings();
	var id = options['id'];

	if (this.ycdAudio) {
		this.ycdAudio.play();
	}
	var behavior = options['ycd-countdown-expire-behavior'];
	var expireText = options['ycd-expire-text'];
	var expireUrl = options['ycd-expire-url'];
	var countdownWrapper = jQuery('.ycd-timer-wrapper-'+id);

	switch(behavior) {
		case 'hideCountdown':
			countdownWrapper.hide();
			break;
		case 'showText':
			countdownWrapper.replaceWith(expireText);
			break;
		case 'redirectToURL':
			countdownWrapper.fadeOut('slow');
			window.location.href = expireUrl;
			break;
	}
};

YcdTimer.prototype.startTimer = function() {
	var that = this;
	this.countdownHandle = setInterval(function() {
		that.decrementTimer();
	}, 1000);
};

YcdTimer.prototype.stopTimer = function() {
	clearInterval(this.countdownHandle);
	this.startAlarm();
};

YcdTimer.prototype.resetTimer = function() {
	var settings = this.getSettings();
	this.remainingTime = (settings['hours'] * 60 * 60 * 1000) +
		(settings['minutes'] * 60 * 1000) +
		(settings['seconds'] * 1000);
	this.renderTimer();
};

YcdTimer.prototype.renderTimer =  function() {
	var deltaTime = this.remainingTime;

	var hoursValue = Math.floor(deltaTime / (1000 * 60 * 60));
	deltaTime = deltaTime % (1000 * 60 * 60);

	var minutesValue = Math.floor(deltaTime / (1000 * 60));
	deltaTime = deltaTime % (1000 * 60);

	var secondsValue = Math.floor(deltaTime / (1000));

	this.animateTime(hoursValue, minutesValue, secondsValue);
};

YcdTimer.prototype.animateTime = function(remainingHours, remainingMinutes, remainingSeconds) {
	var id = this.getId();
	/* position */
	var hoursValueTarget = jQuery('.ycd-hours-value-'+id);
	var minutesValueTarget = jQuery('.ycd-minutes-value-'+id);
	var secondsValueTarget = jQuery('.ycd-seconds-value-'+id);

	hoursValueTarget.css('top', '0em');
	minutesValueTarget.css('top', '0em');
	secondsValueTarget.css('top', '0em');

	var hoursNext = jQuery('.ycd-hours-next-value-'+id);
	var minutesNext = jQuery('.ycd-minutes-next-value-'+id);
	var secondsNext = jQuery('.ycd-seconds-next-value-'+id);

	hoursNext.css('top', '0em');
	minutesNext.css('top', '0em');
	secondsNext.css('top', '0em');

	var oldHoursString = hoursNext.first().text();
	var oldMinutesString = minutesNext.first().text();
	var oldSecondsString = secondsNext.first().text();

	var hoursString = this.formatTime(remainingHours);
	var minutesString = this.formatTime(remainingMinutes);
	var secondsString = this.formatTime(remainingSeconds);

	hoursValueTarget.text(oldHoursString);
	minutesValueTarget.text(oldMinutesString);
	secondsValueTarget.text(oldSecondsString);

	hoursNext.text(hoursString);
	minutesNext.text(minutesString);
	secondsNext.text(secondsString);

	/* set and animate */
	if(oldHoursString !== hoursString) {
		hoursValueTarget.animate({top: '-=1em'});
		jQuery('.ycd-hours-next-value-'+id).animate({top: '-=1em'});
	}

	if(oldMinutesString !== minutesString) {
		minutesValueTarget.animate({top: '-=1em'});
		jQuery('.ycd-miuntes-next-value-'+id).animate({top: '-=1em'});
	}

	if(oldSecondsString !== secondsString) {
		secondsValueTarget.animate({top: '-=1em'});
		jQuery('.ycd-seconds-next-value-'+id).animate({top: '-=1em'});
	}
};


YcdTimer.prototype.formatTime = function(intergerValue) {
	return intergerValue > 9 ? intergerValue.toString() : '0' + intergerValue.toString();
};

YcdTimer.prototype.decrementTimer = function() {
	this.remainingTime -= (1 * 1000);

	if(this.remainingTime < 1000) {
		this.endBehavior();
		this.onStopTimer();
	}

	this.renderTimer();
};

YcdTimer.prototype.livePreview = function() {
	this.changeTime();
	this.changeFontFamily();
	this.changeFontSize();
	this.changeContnetPadding();
	this.changeColor();
	this.imageUpload();
	this.changeBackgroundImage();
	this.changeAlignment();
};

YcdTimer.prototype.changeAlignment = function() {
	var alignment = jQuery('.ycd-timer-content-alignment');

	if (!alignment.length) {
		return false;
	}

	var postId = parseInt(jQuery('#post_ID').val());
	var timerWrapper = jQuery('.ycd-timer-wrapper-'+postId);

	alignment.bind('change', function() {
		timerWrapper.css({'text-align': jQuery(this).val()})
	});
};

YcdTimer.prototype.changeBackgroundImage = function() {
	var bgSize = jQuery('.js-ycd-bg-size');

	if(!bgSize.length) {
		return false;
	}
	var postId = parseInt(jQuery('#post_ID').val());
	var timerWrapper = jQuery('.ycd-timer-wrapper-'+postId);
	bgSize.bind('change', function() {
		var val = jQuery(this).val();
		timerWrapper.css({'background-size': val});
	});

	jQuery('.js-bg-image-repeat').bind('change', function() {
		var val = jQuery(this).val();
		timerWrapper.css({'background-repeat': val});
	});

	jQuery('#ycd-bg-image-url').bind('change', function() {
		var url = jQuery(this).val();
		timerWrapper.css('background-image', 'url('+url+')');
	});
};

YcdTimer.prototype.imageUpload = function() {
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

YcdTimer.prototype.changeColor = function() {
	var timerColor = jQuery('#ycd-timer-color');
	
	if (!timerColor.length) {
		return false;
	}
	jQuery('#ycd-timer-color').minicolors({
		change: function() {
			var val = jQuery(this).val();
			jQuery('.ycd-timer-box span').css({color: val})
		}
	})
};

YcdTimer.prototype.changeContnetPadding = function() {
	var padding = jQuery('#ycd-timer-content-padding');

	if (!padding.length) {
		return false;
	}
	var postId = parseInt(jQuery('#post_ID').val());

	padding.bind('change', function() {
		var val = parseInt(jQuery(this).val())+'px';
		jQuery('.ycd-timer-content-wrapper-'+postId).css({padding: val})
	});
};

YcdTimer.prototype.changeFontSize = function() {
	var fontSlider = jQuery('#ycd-js-digital-font-size');

	if (!fontSlider.length) {
		return false;
	}
	var postId = parseInt(jQuery('#post_ID').val());

	fontSlider.ionRangeSlider({
		hide_min_max: true,
		keyboard: false,
		min: 3,
		max: 10,
		type: 'single',
		step: 1,
		prefix: '',
		grid: false
	}).change(function() {
		var val = jQuery(this).val();
		jQuery('#ycd-digit-font-size').remove();
		jQuery('#ycd-digit-font-size-'+postId).remove();
		jQuery('body').append('<style id="ycd-digit-font-size">.ycd-timer-time {font-size: '+val+'em;}</style>');
	});

};

YcdTimer.prototype.changeFontFamily = function() {
	var fontFamily = jQuery('.js-countdown-font-family');

	if (!fontFamily.length) {
		return false;
	}
	var postId = parseInt(jQuery('#post_ID').val());
	fontFamily.bind('change', function() {

		jQuery('#ycd-digit-font-family').remove();
		jQuery('#ycd-digit-font-family-'+postId).remove();
		var fontFamily = jQuery('option:selected', this).val();
		jQuery('body').append('<style id="ycd-digit-font-family">.ycd-timer-box > span {font-family: '+fontFamily+'}</style>');
	});
};

YcdTimer.prototype.changeTime = function() {
	var timeSettings = jQuery('.ycd-timer-time-settings');

	if (!timeSettings.length) {
		return false;
	}
	var that = this;
	var settings = that.getSettings();

	timeSettings.bind('change', function() {
		var type = jQuery(this).data('type');
		settings[type] = jQuery(this).val();
		that.setSettings(settings);
		that.resetTimer();
		that.this.startTimer();
	})
};

jQuery(document).ready(function() {
	window.YcdTimersInstance = [];
	var renderIds = [];
	jQuery('.ycd-timer-time').each(function() {
		var options = jQuery(this).data('options');
		var id = jQuery(this).data('id');
		if (renderIds.indexOf(id) != '-1') {
			return true;
		}
		renderIds.push(id);
		var timerObj = new YcdTimer();
		timerObj.setSettings(options);
		timerObj.setId(id);
		timerObj.init();
		window.YcdTimersInstance.push(timerObj);
	});
});