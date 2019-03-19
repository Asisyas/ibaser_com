<?php
namespace ycd;

class Clock2Countdown extends Countdown {
	
	public function __construct() {
		$this->setIsCountdown(false);
		add_filter('ycdGeneralMetaboxes', array($this, 'metaboxes'));
		add_action('add_meta_boxes', array($this, 'mainOptions'));
		add_filter('ycdCountdownDefaultOptions', array($this, 'defaultOptions'), 1, 1);
	}
	
	public function metaboxes($mtaboxes) {
		unset($mtaboxes['generalOptions']);
		unset($mtaboxes['afterCountdownExpire']);
		
		return $mtaboxes;
	}
	
	public function defaultOptions($options) {
		
		return $options;
	}
	
	public function includeStyles() {
		$this->includeGeneralScripts();
		wp_enqueue_script("jquery-ui-draggable");
		ScriptsIncluder::registerScript('canvas_clock.js', array('dirUrl' => YCD_COUNTDOWN_JS_URL.'clock/'));
		ScriptsIncluder::enqueueScript('canvas_clock.js');
		ScriptsIncluder::registerScript('Clock.js', array('dirUrl' => YCD_COUNTDOWN_JS_URL.'clock/'));
		ScriptsIncluder::enqueueScript('Clock.js');
	}
	
	public function mainOptions(){
		parent::mainOptions();
		add_meta_box('ycdMainOptions', __('Clock options', YCD_TEXT_DOMAIN), array($this, 'mainView'), YCD_COUNTDOWN_POST_TYPE, 'normal', 'high');
	}
	
	public function mainView() {
		$typeObj = $this;
		require_once YCD_VIEWS_MAIN_PATH.'clock2View.php';
	}
	
	public function renderLivePreview()
	{
		$typeObj = $this;
		require_once YCD_PREVIEW_VIEWS_PATH . 'circlePreview.php';
	}
	
	private function getClockArgs() {
		$args = array(
			'indicate' => true,
			'indicate_color' => '#222',
			'dial1_color' => '#666600',
			'dial2_color' => '#81812e',
			'dial3_color' => '#9d9d5c',
			'time_add' => 1,
			'time_24h' => true,
			'date_add' => 3,
			'date_add_color' => '#999',
		);
		
		return $args;
	}
	
	private function getCanvasOptions() {
		$options = array();
		$width = (int)$this->getOptionValue('ycd-clock2-width');
		$timeZone = $this->getOptionValue('ycd-clock2-time-zone');
		
		$options['width'] = $width;
		$options['timeZone'] = $timeZone;
		
		return $options;
	}
	
	private function getStylesStr() {
		$align = $this->getOptionValue('ycd-clock2-alignment');
		$id = $this->getId();
		
		$style = '<style type="text/css">';
		$style .= '.ycd-countdown-'.esc_attr($id).'-wrapper {';
		$style .= 'text-align: '.$align;
		$style .= '}';
		$style .= '</style>';
		
		return $style;
	}
	
	public function getViewContent() {
		$this->includeStyles();
		$id = $this->getId();
		
		$options = $this->getCanvasOptions();
		$width = @$options['width'];
		$args = $this->getClockArgs();
		
		$args = json_encode($args);
		$options = json_encode($options);
		
		$content = '<div class="ycd-countdown-wrapper ycd-countdown-'.esc_attr($id).'-wrapper">';
		$content .= '<canvas data-args="'.esc_attr($args).'" data-options="'.esc_attr($options).'" class="ycdClock2" width="'.$width.'px" height="'.$width.'px"></canvas>';
		$content .= $this->renderSubscriptionForm();
		$content .= '</div>';
		$content .= $this->getStylesStr();
		
		return $content;
	}
}