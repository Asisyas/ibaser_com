<?php

class YcdCountdownOptionsConfig {

	public static function init() {
		global $YCD_TYPES;

		$YCD_TYPES['typeName'] = apply_filters('ycdTypes', array(
			'circle' => YCD_FREE_VERSION,
			'timer' => YCD_FREE_VERSION,
			'clock1' => YCD_FREE_VERSION,
			'clock2' => YCD_FREE_VERSION,
			'clock3' => YCD_FREE_VERSION,
			'clock4' => YCD_SILVER_VERSION,
			'clock5' => YCD_SILVER_VERSION,
			'clock6' => YCD_SILVER_VERSION,
			'clock7' => YCD_SILVER_VERSION,
			'sticky' => YCD_SILVER_VERSION,
			'woo' => YCD_GOLD_VERSION,
			'circlePopup' => YCD_SILVER_VERSION,
			'flipClock' => YCD_SILVER_VERSION,
			'flipClockPopup' => YCD_SILVER_VERSION
		));

		$YCD_TYPES['typePath'] = apply_filters('ycdTypePaths', array(
			'circle' => YCD_COUNTDOWNS_PATH,
			'timer' => YCD_COUNTDOWNS_PATH,
			'clock1' => YCD_COUNTDOWNS_PATH,
			'clock2' => YCD_COUNTDOWNS_PATH,
			'clock3' => YCD_COUNTDOWNS_PATH,
			'clock4' => YCD_COUNTDOWNS_PATH,
			'clock5' => YCD_COUNTDOWNS_PATH,
			'clock6' => YCD_COUNTDOWNS_PATH,
			'clock7' => YCD_COUNTDOWNS_PATH,
			'sticky' => YCD_COUNTDOWNS_PATH,
			'woo' => YCD_COUNTDOWNS_PATH,
			'circlePopup' => YCD_COUNTDOWNS_PATH,
			'flipClock' => YCD_COUNTDOWNS_PATH,
			'flipClockPopup' => YCD_COUNTDOWNS_PATH
		));
		
		$YCD_TYPES['titles'] = apply_filters('ycdTitles', array(
			'circle' => __('Circle', YCD_TEXT_DOMAIN),
			'timer' => __('Timer', YCD_TEXT_DOMAIN),
			'clock1' => __('Clock 1', YCD_TEXT_DOMAIN),
			'clock2' => __('Clock 2', YCD_TEXT_DOMAIN),
			'clock3' => __('Clock 3', YCD_TEXT_DOMAIN),
			'clock4' => __('Clock 4', YCD_TEXT_DOMAIN),
			'clock5' => __('Clock 5', YCD_TEXT_DOMAIN),
			'clock6' => __('Clock 6', YCD_TEXT_DOMAIN),
			'clock7' => __('Clock 7', YCD_TEXT_DOMAIN),
			'sticky' => __('Sticky countdown', YCD_TEXT_DOMAIN),
			'woo' => __('WooCommerce countdown', YCD_TEXT_DOMAIN),
			'circlePopup' => __('Circle Popup', YCD_TEXT_DOMAIN),
			'flipClock' => __('Flip Clock', YCD_TEXT_DOMAIN),
			'flipClockPopup' => __('Flip Clock Popup', YCD_TEXT_DOMAIN)
		));

		$YCD_TYPES['youtubeUrls'] = apply_filters('ycdYoutubeUrls', array(
			'clock5' => 'https://www.youtube.com/watch?v=NbP4aKPrWfM&',
			'clock6' => 'https://www.youtube.com/watch?v=rsWijVfKQzk',
			'clock7' => 'https://www.youtube.com/watch?v=WqsbNipqyCM',
			'sticky' => 'https://www.youtube.com/watch?v=sK9A-ADoy8Y',
			'woo' => 'https://www.youtube.com/watch?v=ObLMBFp69ro',
			'circlePopup' => 'https://www.youtube.com/watch?v=KUEvK0FuErw',
			'flipClock' => 'https://www.youtube.com/watch?v=Zb7fIkEBcio',
			'flipClockPopup' => 'https://www.youtube.com/watch?v=i46qN2sFwZc'
		));
	}

	public static function optionsValues() {
		global $YCD_OPTIONS;
		$options = array();
		$options[] = array('name' => 'ycd-type', 'type' => 'text', 'defaultValue' => 'circle');
		$options[] = array('name' => 'ycd-countdown-date-type', 'type' => 'text', 'defaultValue' => 'dueDate');
		$options[] = array('name' => 'ycd-date-time-picker', 'type' => 'text', 'defaultValue' => date('Y-m-d H:i', strtotime(' +1 day')));
		$options[] = array('name' => 'ycd-date-progress-start-date', 'type' => 'text', 'defaultValue' => date('Y-m-d H:i'));
		$options[] = array('name' => 'ycd-circle-time-zone', 'type' => 'text', 'defaultValue' => self::getDefaultTimezone());
		$options[] = array('name' => 'ycd-circle-animation', 'type' => 'text', 'defaultValue' => 'smooth');
		$options[] = array('name' => 'ycd-circle-alignment', 'type' => 'text', 'defaultValue' => 'center');
		$options[] = array('name' => 'ycd-countdown-width', 'type' => 'text', 'defaultValue' => '500');
		$options[] = array('name' => 'ycd-dimension-measure', 'type' => 'text', 'defaultValue' => 'px');
		$options[] = array('name' => 'ycd-countdown-background-circle', 'type' => 'checkbox', 'defaultValue' => 'on');
		$options[] = array('name' => 'ycd-countdown-months', 'type' => 'checkbox', 'defaultValue' => '');
		$options[] = array('name' => 'ycd-countdown-months-text', 'type' => 'text', 'defaultValue' => __('Months', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-countdown-years', 'type' => 'checkbox', 'defaultValue' => '');
		$options[] = array('name' => 'ycd-countdown-years-text', 'type' => 'text', 'defaultValue' => __('Years', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-countdown-days', 'type' => 'checkbox', 'defaultValue' => 'on');
		$options[] = array('name' => 'ycd-countdown-days-text', 'type' => 'text', 'defaultValue' => __('DAYS', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-countdown-hours', 'type' => 'checkbox', 'defaultValue' => 'on');
		$options[] = array('name' => 'ycd-countdown-hours-text', 'type' => 'text', 'defaultValue' => __('HOURS', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-countdown-minutes', 'type' => 'checkbox', 'defaultValue' => 'on');
		$options[] = array('name' => 'ycd-countdown-minutes-text', 'type' => 'text', 'defaultValue' => __('MINUTES', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-countdown-seconds', 'type' => 'checkbox', 'defaultValue' => 'on');
		$options[] = array('name' => 'ycd-countdown-seconds-text', 'type' => 'text', 'defaultValue' => __('SECONDS', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-countdown-direction', 'type' => 'text', 'defaultValue' => __('Clockwise', YCD_TEXT_DOMAIN));
		$options[] = array(
			'name' => 'ycd-countdown-expire-behavior',
			'type' => 'text',
			'defaultValue' => __('hideCountdown', YCD_TEXT_DOMAIN),
			'ver' => YCD_SILVER_VERSION,
			'allow' => array('hideCountdown', 'default')
		);
		$options[] = array('name' => 'ycd-expire-text', 'type' => 'html', 'defaultValue' => __('', YCD_TEXT_DOMAIN), 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-expire-url', 'type' => 'text', 'defaultValue' => __('', YCD_TEXT_DOMAIN), 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-months-color', 'type' => 'text', 'defaultValue' => '#8A2BE2', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-months-text-color', 'type' => 'text', 'defaultValue' => '#000000', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-years-color', 'type' => 'text', 'defaultValue' => '#A52A2A', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-years-text-color', 'type' => 'text', 'defaultValue' => '#000000', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-days-color', 'type' => 'text', 'defaultValue' => '#FFCC66', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-days-text-color', 'type' => 'text', 'defaultValue' => '#000000', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-hours-color', 'type' => 'text', 'defaultValue' => '#99CCFF', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-hours-text-color', 'type' => 'text', 'defaultValue' => '#000000', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-minutes-color', 'type' => 'text', 'defaultValue' => '#BBFFBB', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-minutes-text-color', 'type' => 'text', 'defaultValue' => '#000000', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-seconds-color', 'type' => 'text', 'defaultValue' => '#FF9999', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-seconds-text-color', 'type' => 'text', 'defaultValue' => '#000000', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-circle-width', 'type' => 'text', 'defaultValue' => '0.1');
		$options[] = array('name' => 'ycd-circle-bg-width', 'type' => 'text', 'defaultValue' => '1.2');
		$options[] = array('name' => 'ycd-circle-start-angle', 'type' => 'text', 'defaultValue' => 0);
		$options[] = array('name' => 'ycd-countdown-bg-image', 'type' => 'checkbox', 'defaultValue' => 0, 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-bg-image-size', 'type' => 'text', 'defaultValue' => 'cover', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-bg-image-repeat', 'type' => 'text', 'defaultValue' => 'no-repeat', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-bg-image-url', 'type' => 'text', 'defaultValue' => '', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-bg-circle-color', 'type' => 'text', 'defaultValue' => '#60686F', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-text-font-size', 'type' => 'text', 'defaultValue' => '9');
		$options[] = array('name' => 'ycd-countdown-number-size', 'type' => 'text', 'defaultValue' => '35');
		$options[] = array('name' => 'ycd-countdown-number-font-weight', 'type' => 'text', 'defaultValue' => 'bold');
		$options[] = array('name' => 'ycd-countdown-font-weight', 'type' => 'text', 'defaultValue' => 'normal');
		$options[] = array('name' => 'ycd-countdown-font-style', 'type' => 'text', 'defaultValue' => 'initial');
		$options[] = array('name' => 'ycd-text-font-family', 'type' => 'text', 'defaultValue' => 'Century Gothic', 'ver' => YCD_SILVER_VERSION);
		$options[] = array('name' => 'ycd-countdown-padding', 'type' => 'text', 'defaultValue' => 0);
		$options[] = array('name' => 'ycd-flip-time-zone', 'type' => 'text', 'defaultValue' => self::getDefaultTimezone());
		$options[] = array('name' => 'ycd-flip-date-time-picker', 'type' => 'text', 'defaultValue' => date('Y-m-d H:i', strtotime(' +1 day')));
		$options[] = array('name' => 'ycd-countdown-duration-hours', 'type' => 'number', 'defaultValue' => 0);
		$options[] = array('name' => 'ycd-countdown-duration-minutes', 'type' => 'number', 'defaultValue' => 0);
		$options[] = array('name' => 'ycd-countdown-duration-seconds', 'type' => 'number', 'defaultValue' => 30);

		// timer clock
		$options[] = array('name' => 'ycd-timer-hours', 'type' => 'number', 'defaultValue' => 0);
		$options[] = array('name' => 'ycd-timer-minutes', 'type' => 'number', 'defaultValue' => 0);
		$options[] = array('name' => 'ycd-timer-seconds', 'type' => 'number', 'defaultValue' => 30);
		$options[] = array('name' => 'ycd-timer-font-size', 'type' => 'number', 'defaultValue' => 6);
		$options[] = array('name' => 'ycd-timer-content-padding', 'type' => 'number', 'defaultValue' => 0);
		$options[] = array('name' => 'ycd-timer-bg-image', 'type' => 'checkbox', 'defaultValue' => 0);
		$options[] = array('name' => 'ycd-timer-content-alignment', 'type' => 'text', 'defaultValue' => 'center');

		// clock
		$options[] = array('name' => 'ycd-clock1-time-zone', 'type' => 'text', 'defaultValue' => '');
		$options[] = array('name' => 'ycd-clock1-width', 'type' => 'text', 'defaultValue' => 200);
		$options[] = array('name' => 'ycd-clock1-alignment', 'type' => 'text', 'defaultValue' => 'center');
		$options[] = array('name' => 'ycd-clock2-width', 'type' => 'text', 'defaultValue' => 200);
		$options[] = array('name' => 'ycd-clock2-alignment', 'type' => 'text', 'defaultValue' => 'center');
		$options[] = array('name' => 'ycd-clock3-width', 'type' => 'text', 'defaultValue' => 200);
		$options[] = array('name' => 'ycd-clock3-alignment', 'type' => 'text', 'defaultValue' => 'center');
		$options[] = array('name' => 'ycd-clock4-width', 'type' => 'text', 'defaultValue' => 200);
		$options[] = array('name' => 'ycd-clock4-alignment', 'type' => 'text', 'defaultValue' => 'center');
		$options[] = array('name' => 'ycd-clock5-width', 'type' => 'text', 'defaultValue' => 200);
		$options[] = array('name' => 'ycd-clock5-alignment', 'type' => 'text', 'defaultValue' => 'center');
		$options[] = array('name' => 'ycd-clock6-width', 'type' => 'text', 'defaultValue' => 200);
		$options[] = array('name' => 'ycd-clock6-alignment', 'type' => 'text', 'defaultValue' => 'center');
		$options[] = array('name' => 'ycd-clock7-width', 'type' => 'text', 'defaultValue' => 200);
		$options[] = array('name' => 'ycd-clock7-alignment', 'type' => 'text', 'defaultValue' => 'center');
		
		$options[] = array('name' => 'ycd-sticky-button-text', 'type' => 'text', 'defaultValue' => __('Checkout', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-sticky-bg-color', 'type' => 'text', 'defaultValue' => '#000000');
		$options[] = array('name' => 'ycd-sticky-button-color', 'type' => 'text', 'defaultValue' => '#fff');
		$options[] = array('name' => 'ycd-sticky-text-color', 'type' => 'text', 'defaultValue' => '#fff');
		$options[] = array('name' => 'ycd-sticky-text-background-color', 'type' => 'text', 'defaultValue' => '#555');
		$options[] = array('name' => 'ycd-sticky-countdown-text-color', 'type' => 'text', 'defaultValue' => '#fff');
		$options[] = array('name' => 'ycd-sticky-all-pages', 'type' => 'checkbox', 'defaultValue' => '');
		
		if(YCD_PKG_VERSION > YCD_FREE_VERSION) {
			require_once dirname(__FILE__) . '/proOptionsConfig.php';
		}

		$options[] = array('name' => 'ycd-countdown-hide-mobile', 'type' => 'checkbox', 'defaultValue' => '');
		$options[] = array('name' => 'ycd-countdown-show-mobile', 'type' => 'checkbox', 'defaultValue' => '');
		$options[] = array('name' => 'ycd-countdown-selected-countries', 'type' => 'checkbox', 'defaultValue' => '', 'available' => YCD_PLATINUM_VERSION);
		$options[] = array('name' => 'ycd-counties-names', 'type' => 'array', 'defaultValue' => '');
		$options[] = array('name' => 'ycd-countdown-end-sound', 'type' => 'checkbox', 'defaultValue' => '');
		$options[] = array('name' => 'ycd-countdown-end-sound-url', 'type' => 'text', 'defaultValue' => YCD_COUNTDOWN_LIB_URL.'alarm.mp3');
		$options[] = array('name' => 'ycd-enable-subscribe-form', 'type' => 'checkbox', 'defaultValue' => '');
		$options[] = array('name' => 'ycd-subscribe-width', 'type' => 'text', 'defaultValue' => '100%');
		$options[] = array('name' => 'ycd-form-above-text', 'type' => 'text', 'defaultValue' => __('Join Our Newsletter', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-form-input-text', 'type' => 'text', 'defaultValue' => __('Enter your email here', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-form-submit-text', 'type' => 'text', 'defaultValue' => __('Subscribe', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-subscribe-success-message', 'type' => 'text', 'defaultValue' => __('Thanks for subscribing.', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-subscribe-error-message', 'type' => 'text', 'defaultValue' => __('Invalid email address.', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-form-submit-color', 'type' => 'text', 'defaultValue' => __('#3274d1', YCD_TEXT_DOMAIN));
		$options[] = array('name' => 'ycd-stick-countdown-font-size', 'type' => 'text', 'defaultValue' => __('25', YCD_TEXT_DOMAIN));

		$YCD_OPTIONS = apply_filters('ycdCountdownDefaultOptions', $options);
	}

	public static function getDefaultTimezone() {
		$timezone = get_option('timezone_string');
		if (!$timezone) {
			$timezone = 'America/New_York';
		}

		return $timezone;
	}
}

YcdCountdownOptionsConfig::init();