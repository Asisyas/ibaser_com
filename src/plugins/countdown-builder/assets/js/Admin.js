function YcdAdmin() {
	this.init();
}

YcdAdmin.prototype.init = function() {
	this.initCountdownDateTimePicker();
	this.select2();
	this.accordionContent();
	this.livePreviewToggle();
	this.multipleChoiceButton();
	this.switchCountdown();
	this.soundUpload();
	this.resetSound();
	this.soundPreview();
	this.support();
	this.livePreview();
	this.redirectToProWebpage();
	this.newsletter();
	this.promotionalVideo();

	/*clock*/
	this.clockLivePreview();
};

YcdAdmin.prototype.promotionalVideo = function() {
	var target = jQuery('.ycd-play-promotion-video');

	if(!target.length) {
		return false;
	}

	target.bind('click', function(e) {
		e.preventDefault();
		var href = jQuery(this).data('href');
		window.open(href);
	});
}

YcdAdmin.prototype.clockLivePreview = function() {
	this.changeClcokWidth();
	this.changeTimeZone();
	this.changeAlignClock();
};

YcdAdmin.prototype.changeClcokWidth = function() {
	var width = jQuery('.ycd-clock-width');

	if (width.length) {
		var that = this;
		width.bind('change', function() {
			var targetId = jQuery(this).data('target-index');
			var widthVal = parseInt(jQuery(this).val())+'px';
			var cnavas = jQuery('.ycdClock'+targetId);

			cnavas.attr('width', widthVal);
			cnavas.attr('height', widthVal);

			that.reinitClock(targetId);
		});
	}
};

YcdAdmin.prototype.changeTimeZone = function() {
	var timeZone = jQuery('.js-circle-time-zone');

	if(!timeZone.length) {
		return false;
	}
	var that = this;
	
	timeZone.bind('change', function() {
		var val = jQuery(this).val();
		var targetId = jQuery(this).data('target-index');

		if(!targetId) {
			return false;
		}
		var options = jQuery('.ycdClock'+targetId).data('options');
		if(!options) {
			return false;
		}
		options['timeZone'] = val;
		jQuery('.ycdClock'+targetId).attr('data-options', options);

		that.reinitClock(targetId);
	});
};

YcdAdmin.prototype.changeAlignClock = function() {
	var alignement = jQuery('.ycd-clock-alignment');

	if(!alignement.length) {
		return false;
	}
	var that = this;

	alignement.bind('change', function() {
		var val = jQuery(this).val();
		jQuery('.ycd-countdown-wrapper').css({'text-align': val});
	});
};

YcdAdmin.prototype.reinitClock = function(targetId) {
	var targetClassName = '.ycdClock'+targetId;
	var cnavas = jQuery(targetClassName);
	var dataArgs = cnavas.data('args');
	var dataOptions = cnavas.data('options');

	var width = jQuery(targetClassName).width();
	var height = jQuery(targetClassName).height();

	jQuery(targetClassName).remove();
	jQuery('.ycd-countdown-wrapper').prepend('<canvas data-args='+JSON.stringify(dataArgs)+' data-options='+JSON.stringify(dataOptions)+' class="ycdClock'+targetId+'" width="'+width+'px" height="'+height+'px"></canvas>');

	if (typeof YcdClock != 'undefined') {
		var obj = new YcdClock();
	}
	else if (typeof YcdClockPro != 'ndefined') {
		var obj = new YcdClockPro();
	}

	obj.init()
};

YcdAdmin.prototype.getTinymceContent = function()
{
	if (jQuery('.wp-editor-wrap').hasClass('tmce-active')) {
		return tinyMCE.activeEditor.getContent();
	}

	return jQuery('#ycd-newsletter-text').val();
};

YcdAdmin.prototype.newsletter = function() {
	var sendButton = jQuery('.js-send-newsletter');

	if (!sendButton.length) {
		return false;
	}
	var that = this;

	sendButton.bind('click', function(e) {
		e.preventDefault();
		jQuery('.ycd-validation-error').addClass('ycd-hide');
		var validationStatus = true;
		var fromEmail = jQuery('.ycd-newsletter-from-email').val();
		var subscriptionFormId = jQuery('.js-ycd-newsletter-forms option:selected').val();
		subscriptionFormId = parseInt(subscriptionFormId);
		var validateEmail =  fromEmail.search(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/);
		var emailsInFlow = jQuery('.ycd-emails-in-flow').val();
		emailsInFlow = parseInt(emailsInFlow);

		if (isNaN(subscriptionFormId)) {
			jQuery('.ycd-newsletter-error').removeClass('ycd-hide');
			validationStatus = false;
		}

		/*When the sent email isn't valid or the user hasn't selected any subscription form.*/
		if (validateEmail == -1 ) {
			validationStatus = false;
			jQuery('.ycd-newsletter-from-email-error').removeClass('ycd-hide');
		}

		if (isNaN(emailsInFlow)) {
			jQuery('.ycd-emails-in-flow-error').removeClass('ycd-hide');
			validationStatus = false;
		}

		if (!validationStatus) {
			return false;
		}

		var newsletterSubject = jQuery('.ycd-newsletter-subject').val();
		var messageBody = that.getTinymceContent();

		var data = {
			nonce: ycd_admin_localized.nonce,
			action: 'ycd_send_newsletter',
			newsletterData: {
				subscriptionFormId: subscriptionFormId,
				beforeSend: function() {
					jQuery('.ycd-js-newsletter-spinner').removeClass('ycd-hide');
					jQuery('.ycd-newsletter-notice').addClass('ycd-hide');
				},
				fromEmail: fromEmail,
				emailsInFlow: emailsInFlow,
				newsletterSubject: newsletterSubject,
				messageBody: messageBody
			}
		};

		jQuery.post(ajaxurl, data, function() {
			jQuery('.ycd-newsletter-notice').removeClass('ycd-hide');
			jQuery('.ycd-js-newsletter-spinner').addClass('ycd-hide');
		});
	});
};

YcdAdmin.prototype.redirectToProWebpage = function() {
	jQuery('.ycd-upgrade-button-red').bind('click', function(e) {
		window.open(ycd_admin_localized.proUrl);
	})
};

YcdAdmin.prototype.livePreview = function() {
	var preview = jQuery('.ycd-live-preview');

	if (!preview.length) {
		return false;
	}

	preview.draggable();
};

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

YcdAdmin.prototype.support = function() {
	var submit = jQuery('#ycd-support-request-button');

	if(!submit.length) {
		return false;
	}
	jQuery('#ycd-form').submit(function(e) {
		e.preventDefault();
		var isValid = true;
		var emailError = jQuery('.ycd-validate-email-error');
		emailError.addClass('ycd-hide');
		jQuery('.ycd-required-fields').each(function() {
			var currentVal = jQuery(this).val();
			jQuery('.'+jQuery(this).data('error')).addClass('ycd-hide');

			if(!currentVal) {
				isValid = false;
				jQuery('.'+jQuery(this).data('error')).removeClass('ycd-hide');
			}
		});

		if(!isValid) {
			return false;
		}

		if(!validateEmail(jQuery('#ycd-email').val())) {
			emailError.removeClass('ycd-hide');
			return false;
		}
		var data = {
			action: 'ycdSupport',
			nonce: ycd_admin_localized.nonce,
			formData: jQuery(this).serialize(),
			beforeSend: function() {
				submit.prop('disabled', true);
				jQuery('.ycd-support-spinner').removeClass('ycd-hide')
			}
		};

		jQuery.post(ajaxurl, data, function(result) {
			submit.prop('disabled', false);
			jQuery('.ycd-support-spinner').addClass('ycd-hide');
			jQuery('#ycd-form').remove();
			jQuery('.ycd-support-success').removeClass('ycd-hide');
		});
	});
};

YcdAdmin.prototype.soundPreview = function()  {
	var songValue = 1;
	var lastSong = undefined;

	jQuery('.js-preview-sound').bind('click', function() {
		var uploadFile = jQuery('#js-sound-open-url').val();
		if (typeof lastSong == 'undefined') {
			lastSong = new Audio (uploadFile);
		}

		/*
		 * songValue == 1 should be song
		 * songValue == 2 song should be pause
		 */
		if(songValue == 1) {
			lastSong.play();
			songValue = 2;

		}
		else if(songValue == 2) {
			lastSong.pause();
			songValue = 1;

		}

		lastSong.onended = function()
		{
			lastSong = undefined;
			songValue = 1;
		}
	});

	jQuery('#js-sound-open-url').change(function() {
		if(typeof lastSong != 'undefined') {
			lastSong.pause();
			lastSong = undefined;
		}
		songValue = 1;
	});

	jQuery('#js-reset-to-default-song').click(function(e) {
		e.preventDefault();

		if(typeof lastSong != 'undefined') {
			lastSong.pause();
			lastSong = undefined;
		}
		songValue = 1;

		var defaultSong = jQuery(this).data('default-song');
		jQuery('#js-sound-open-url').val(defaultSong).change();
	});
};

YcdAdmin.prototype.resetSound = function() {
	var resetButton = jQuery('#js-reset-to-default-song');

	if(!resetButton.length) {
		return false;
	}

	resetButton.bind('click', function() {
		var defaultSoundUrl = jQuery(this).data('default-song');
		jQuery('#js-sound-open-url').val(defaultSoundUrl).change();
	});
};

YcdAdmin.prototype.soundUpload = function() {
	var uploadButton = jQuery('#js-upload-countdown-end-sound');

	if(!uploadButton.length) {
		return false;
	}
	var uploader;
	uploadButton.bind('click', function(e) {
		e.preventDefault();

		if(uploader) {
			uploader.open();
			return false;
		}

		/* Extend the wp.media object */
		uploader = wp.media.frames.file_frame = wp.media({
			titleFF : ycd_admin_localized.changeSound,
			button : {
				text : ycd_admin_localized.changeSound
			},
			library : {type : ['audio/mpeg', 'audio/wav', 'audio/mp3']},
			multiple : false
		});

		/* When a file is selected, grab the URL and set it as the text field's value */
		uploader.on('select', function() {
			var attachment = uploader.state().get('selection').first().toJSON();
			jQuery('#js-sound-open-url').val(attachment.url).change();
		});
		/* Open the uploader dialog */
		uploader.open();
	});
};

YcdAdmin.prototype.switchCountdown = function() {
	var switchCountdown = jQuery('.ycd-countdown-enable');

	if(!switchCountdown.length) {
		return false;
	}

	switchCountdown.each(function() {
		jQuery(this).bind('change', function() {
			var data = {
				action: 'ycd-switch',
				nonce: ycd_admin_localized.nonce,
				id: jQuery(this).data('id'),
				checked: jQuery(this).is(':checked')
			};

			jQuery.post(ajaxurl, data, function() {

			});
		})
	});
};

YcdAdmin.prototype.multipleChoiceButton = function() {
	var choiceOptions = jQuery('.ycd-choice-option-wrapper input');
	if(!choiceOptions.length) {
		return false;
	}

	var that = this;

	choiceOptions.each(function() {

		if(jQuery(this).is(':checked')) {
			that.buildChoiceShowOption(jQuery(this));
		}

		jQuery(this).on('change', function() {
			that.hideAllChoiceWrapper(jQuery(this).parents('.ycd-multichoice-wrapper').first());
			that.buildChoiceShowOption(jQuery(this));
		});
	})
};

YcdAdmin.prototype.hideAllChoiceWrapper = function(choiceOptionsWrapper) {
	choiceOptionsWrapper.find('input').each(function() {
		var choiceInputWrapperId = jQuery(this).attr('data-attr-href');
		jQuery('#'+choiceInputWrapperId).addClass('ycd-hide');
	})
};

YcdAdmin.prototype.buildChoiceShowOption = function(currentRadioButton)  {
	var choiceOptions = currentRadioButton.attr('data-attr-href');
	var currentOptionWrapper = currentRadioButton.parents('.ycd-choice-wrapper').first();
	var choiceOptionWrapper = jQuery('#'+choiceOptions).removeClass('ycd-hide');
	currentOptionWrapper.after(choiceOptionWrapper);
};

YcdAdmin.prototype.livePreviewToggle = function() {
	var livePreviewText = jQuery('.ycd-toggle-icon');

	if (!livePreviewText.length) {
		return false;
	}
	livePreviewText.attr('checked', true);
	livePreviewText.bind('click', function() {
		var isChecked = jQuery(this).attr('checked');

		if (isChecked) {
			jQuery('.ycd-toggle-icon').removeClass('ycd-toggle-icon-open').addClass('ycd-toggle-icon-close');
		}
		else {
			jQuery('.ycd-toggle-icon').removeClass('ycd-toggle-icon-close').addClass('ycd-toggle-icon-open');
		}
	    jQuery('.ycd-countdown-wrapper').slideToggle(1000, 'swing', function () {
	    });
		livePreviewText.attr('checked', !isChecked);
	});
};

YcdAdmin.prototype.accordionContent = function() {

	var that = this;
	var accordionCheckbox = jQuery('.ycd-accordion-checkbox');

	if (!accordionCheckbox.length) {
		return false;
	}
	accordionCheckbox.each(function () {
		that.doAccordion(jQuery(this), jQuery(this).is(':checked'));
	});
	accordionCheckbox.each(function () {
		jQuery(this).bind('change', function () {
			var attrChecked = jQuery(this).is(':checked');
			var currentCheckbox = jQuery(this);
			that.doAccordion(currentCheckbox, attrChecked);
		});
	});
};

YcdAdmin.prototype.doAccordion = function(checkbox, isChecked) {
	var accordionContent = checkbox.parents('.row').nextAll('.ycd-accordion-content').first();

	if(isChecked) {
		accordionContent.removeClass('ycd-hide-content');
	}
	else {
		accordionContent.addClass('ycd-hide-content');
	}
};

YcdAdmin.prototype.select2 = function() {
	var select2 = jQuery('.js-ycd-select');

	if(!select2.length) {
		return false;
	}

	select2.select2();
};

YcdAdmin.prototype.initCountdownDateTimePicker = function() {
	var countdown = jQuery('.ycd-date-time-picker');

	if(!countdown.length) {
		return false;
	}

	countdown.datetimepicker({
		format: 'Y-m-d H:i',
		minDate: 0
	});
};

jQuery(document).ready(function() {
	new YcdAdmin();
});