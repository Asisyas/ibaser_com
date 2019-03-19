<?php

class proOptionsConfig {
	public function __construct() {
		add_filter('ycdCountdownDefaultOptions', array($this, 'defaultOptions'), 1, 1);
	}
	
	public function defaultOptions($defaults) {
		// flip clock
		$defaults[] = array('name' => 'ycd-flip-countdown-alignment', 'type' => 'text', 'defaultValue' => 'left');
		$defaults[] = array('name' => 'ycd-flip-countdown-year', 'type' => 'checkbox', 'defaultValue' => '');
		$defaults[] = array('name' => 'ycd-flip-countdown-year-text', 'type' => 'text', 'defaultValue' => __('YEARS', YCD_TEXT_DOMAIN));
		$defaults[] = array('name' => 'ycd-flip-countdown-week', 'type' => 'checkbox', 'defaultValue' => '');
		$defaults[] = array('name' => 'ycd-flip-countdown-week-text', 'type' => 'text', 'defaultValue' => __('WEEKS', YCD_TEXT_DOMAIN));
		$defaults[] = array('name' => 'ycd-flip-countdown-days', 'type' => 'checkbox', 'defaultValue' => 'on');
		$defaults[] = array('name' => 'ycd-flip-countdown-days-text', 'type' => 'text', 'defaultValue' => __('DAYS', YCD_TEXT_DOMAIN));
		$defaults[] = array('name' => 'ycd-flip-countdown-hours', 'type' => 'checkbox', 'defaultValue' => 'on');
		$defaults[] = array('name' => 'ycd-flip-countdown-hours-text', 'type' => 'text', 'defaultValue' => __('HOURS', YCD_TEXT_DOMAIN));
		$defaults[] = array('name' => 'ycd-flip-countdown-minutes', 'type' => 'checkbox', 'defaultValue' => 'on');
		$defaults[] = array('name' => 'ycd-flip-countdown-minutes-text', 'type' => 'text', 'defaultValue' => __('MINUTES', YCD_TEXT_DOMAIN));
		$defaults[] = array('name' => 'ycd-flip-countdown-seconds', 'type' => 'checkbox', 'defaultValue' => 'on');
		$defaults[] = array('name' => 'ycd-flip-countdown-seconds-text', 'type' => 'text', 'defaultValue' => __('SECONDS', YCD_TEXT_DOMAIN));
		$defaults[] = array('name' => 'ycd-flip-countdown-expire-behavior', 'type' => 'text', 'defaultValue' => 'hideCountdown');
		$defaults[] = array('name' => 'ycd-flip-expire-text', 'type' => 'html', 'defaultValue' => '');
		$defaults[] = array('name' => 'ycd-flipclock-column-size', 'type' => 'html', 'defaultValue' => '1');

		$defaults[] = array('name' => 'ycd-woo-countdown-position', 'type' => 'text', 'defaultValue' => 'woocommerce_single_product_summary');
		$defaults[] = array('name' => 'ycd-woo-countdown-text-color', 'type' => 'text', 'defaultValue' => '#ffffff');
		$defaults[] = array('name' => 'ycd-woo-countdown-font-size', 'type' => 'text', 'defaultValue' => '25');
		$defaults[] = array('name' => 'ycd-woo-show-products', 'type' => 'text', 'defaultValue' => 'showOnAll');
		$defaults[] = array('name' => 'ycd-woo-enable-to-products', 'type' => 'checkbox', 'defaultValue' => '');
		$defaults[] = array('name' => 'ycd-woo-selected-products', 'type' => 'html', 'defaultValue' => '');
		$defaults[] = array('name' => 'ycd-woo-countdown-after-countdown', 'type' => 'html', 'defaultValue' => '');
		$defaults[] = array('name' => 'ycd-woo-countdown-before-countdown', 'type' => 'html', 'defaultValue' => '');

		$defaults[] = array('name' => 'ycd-schedule-start-from', 'type' => 'html', 'defaultValue' => '10:00');
		$defaults[] = array('name' => 'ycd-schedule-end-to', 'type' => 'html', 'defaultValue' => '18:00');
		$defaults[] = array('name' => 'ycd-schedule-time-zone', 'type' => 'html', 'defaultValue' => 'Europe/London');

		$defaults[] = array('name' => 'ycd-progress-main-color', 'type' => 'html', 'defaultValue' => '#0A5F44');
		$defaults[] = array('name' => 'ycd-progress-color', 'type' => 'html', 'defaultValue' => '#CBEA00');
		$defaults[] = array('name' => 'ycd-progress-text-color', 'type' => 'html', 'defaultValue' => '#ffffff');
		$defaults[] = array('name' => 'ycd-progress-width', 'type' => 'html', 'defaultValue' => '90%');
		$defaults[] = array('name' => 'ycd-progress-height', 'type' => 'html', 'defaultValue' => '22px');
		$defaults[] = array('name' => 'ycd-progress-height', 'type' => 'html', 'defaultValue' => '22px');

		$defaults[] = array('name' => 'ycd-clock1-indicate-color', 'type' => 'html', 'defaultValue' => '#222');
		$defaults[] = array('name' => 'ycd-clock1-dial1-color', 'type' => 'html', 'defaultValue' => '#666600');
		$defaults[] = array('name' => 'ycd-clock1-dial2-color', 'type' => 'html', 'defaultValue' => '#81812e');
		$defaults[] = array('name' => 'ycd-clock1-dial3-color', 'type' => 'html', 'defaultValue' => '#9d9d5c');
		$defaults[] = array('name' => 'ycd-clock1-date-color', 'type' => 'html', 'defaultValue' => '#999');
		$defaults[] = array('name' => 'ycd-clock1-time-color', 'type' => 'html', 'defaultValue' => '#333');
		
		$defaults[] = array('name' => 'ycd-countdown-enable-progress', 'type' => 'checkbox', 'defaultValue' => '');
		
		return $defaults;
	}
}

new proOptionsConfig();