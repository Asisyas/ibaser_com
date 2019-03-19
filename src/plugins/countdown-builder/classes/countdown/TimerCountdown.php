<?php
namespace ycd;


class TimerCountdown extends Countdown {
	public function __construct() {
		if(is_admin()) {
			$this->adminConstruct();
		}
	}
	
	public function renderLivePreview() {
		$typeObj = $this;
		require_once YCD_PREVIEW_VIEWS_PATH.'timerPreview.php';
	}
	
	public function adminConstruct() {
		add_filter('ycdGeneralMetaboxes', array($this, 'metaboxes'), 1, 1);
		add_action('add_meta_boxes', array($this, 'mainOptions'));
		add_filter('ycdCountdownDefaultOptions', array($this, 'defaultOptions'), 1, 1);
	}
	
	public function defaultOptions($defaultOptions) {
		$changingOptions = array(
			'ycd-text-font-family' => array('name' => 'ycd-text-font-family', 'type' => 'text', 'defaultValue' => 'Helvetica')
		);
		$defaultOptions = $this->changeDefaultOptionsByNames($defaultOptions, $changingOptions);
		
	    return $defaultOptions;
    }
	
	public function metaboxes($metaboxes) {
		unset($metaboxes['generalOptions']);
		$metaboxes[YCD_PROGRESS_METABOX_KEY] = array('title' => YCD_PROGRESS_METABOX_TITLE, 'position' => 'normal', 'prioritet' => 'high');
		
		return $metaboxes;
	}
	
	public function mainOptions(){
		parent::mainOptions();
		add_meta_box('ycdTimerOptions', __('Timer options', YCD_TEXT_DOMAIN), array($this, 'mainView'), YCD_COUNTDOWN_POST_TYPE, 'normal', 'high');
	}
	
	public function mainView() {
		$typeObj = $this;
		require_once YCD_VIEWS_PATH.'timerMainView.php';
	}
	
	public function getTimerSettings() {
		$options = array();
		$allDataOptions = $this->getDataAllOptions();
		
		$options['id'] = $this->getId();
		$options['hours'] = $this->getOptionValue('ycd-timer-hours');
		$options['minutes'] = $this->getOptionValue('ycd-timer-minutes');
		$options['seconds'] = $this->getOptionValue('ycd-timer-seconds');
		
		return array_merge($options, $allDataOptions);
	}
	
	private function contentStyles() {
		$id = $this->getId();
		$fontFamily = $this->getOptionValue('ycd-text-font-family');
		$fontSize = $this->getOptionValue('ycd-timer-font-size').'em !important';
		$timerColor = $this->getOptionValue('ycd-timer-color');
		$timerContentPadding = (int)$this->getOptionValue('ycd-timer-content-padding').'px';
		$imageUrl = $this->getOptionValue('ycd-bg-image-url');
		$bgImageSize = $this->getOptionValue('ycd-bg-image-size');
		$imageRepeat = $this->getOptionValue('ycd-bg-image-repeat');
		$textAlign = $this->getOptionValue('ycd-timer-content-alignment');
	    ob_start();
	    ?>
            <style type="text/css"  id="ycd-digit-font-family-<?php echo $id; ?>">
                .ycd-timer-wrapper-<?php echo $id; ?> .ycd-timer-box > span {
                    font-family: <?php echo $fontFamily ?>;
                }
            </style>
            <style type="text/css" id="ycd-digit-font-size-<?php echo $id; ?>">
                .ycd-timer-time.ycd-timer-wrapper-<?php echo $id; ?>  {
                    font-size: <?php echo $fontSize ?>;
                }
            </style>
            <style type="text/css" id="ycd-timer-content-padding-<?php echo $id; ?>">
                .ycd-timer-content-wrapper-<?php echo $id; ?> {
                    padding: <?php echo $timerContentPadding ?>;
                }
            </style>
            <style type="text/css">
                .ycd-timer-wrapper-<?php echo $id; ?> .ycd-timer-box > span {
                    color: <?php echo $timerColor; ?>
                }
                .ycd-timer-wrapper-<?php echo $id; ?> {
                    <?php echo 'background-image: url('.$imageUrl.'); background-repeat: '.$imageRepeat.'; background-size: '.$bgImageSize.'; '; ?>
                    text-align: <?php echo $textAlign; ?>;
                }
                
            </style>
        <?php
	    $styles = ob_get_contents();
	    ob_end_clean();
	    
	    return $styles;
    }
	
	private function getTimerContent() {
		$id = $this->getId();
		$options = $this->getTimerSettings();
		$options = json_encode($options);
		ob_start();
		?>
        <div class="ycd-countdown-wrapper ycd-timer-content-wrapper-<?php echo esc_attr($id); ?>">
            <div class="ycd-timer-time ycd-timer-container ycd-timer-wrapper-<?php echo esc_attr($id); ?>" data-options='<?php echo $options; ?>' data-id="<?php echo esc_attr($id); ?>">
                <div class="timer-time-set ycd-timer-box" id="currentTime">
                    <span id="ycdHoursValue" class="ycd-hours-value-<?php echo esc_attr($id); ?>">00</span><span>:</span><span id="ycdMinutesValue" class="ycd-minutes-value-<?php echo esc_attr($id); ?>">00</span><span>:</span><span id="ycdSecondsValue" class="ycd-seconds-value-<?php echo esc_attr($id); ?>">00</span>
                </div>
                <div class="timer-time-set ycd-timer-box" id="nextTime">
                    <span id="ycdHoursNext"class="ycd-hours-next-value-<?php echo esc_attr($id); ?>">00</span><span>:</span><span id="ycdMinutesNext" class="ycd-minutes-next-value-<?php echo esc_attr($id); ?>">00</span><span>:</span><span id="ycdSecondsNext" class="ycd-seconds-next-value-<?php echo esc_attr($id); ?>">00</span>
                </div>
            </div>
            <?php echo $this->renderSubscriptionForm(); ?>
            <?php echo $this->renderProgressBar(); ?>
        </div>
		<?php
		$content = ob_get_contents();
		$content .= $this->contentStyles();
		ob_end_clean();
		
		return $content;
	}
	
	public function renderScripts() {
		wp_enqueue_script('jquery');
		if(YCD_PKG_VERSION != YCD_FREE_VERSION) {
			ScriptsIncluder::registerScript('ycdGoogleFonts.js');
			ScriptsIncluder::enqueueScript('ycdGoogleFonts.js');
        }
		
		ScriptsIncluder::registerScript('ycdTimer.js');
		ScriptsIncluder::localizeScript('ycdTimer.js', 'YcdArgs', array('isAdmin' => is_admin()));
		ScriptsIncluder::enqueueScript('ycdTimer.js');
		ScriptsIncluder::registerStyle('timer.css');
		ScriptsIncluder::enqueueStyle('timer.css');
	}
	
	public function getViewContent() {
		$this->renderScripts();
		
		$content = $this->getTimerContent();
		
		return $content;
	}
}