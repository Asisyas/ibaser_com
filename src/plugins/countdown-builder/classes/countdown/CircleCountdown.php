<?php
namespace ycd;
if (YCD_PKG_VERSION > YCD_FREE_VERSION) {
	if (file_exists(WP_PLUGIN_DIR.'/countdown-builder')) {
		echo "<span><strong>Fatal error:</strong> require_once(): Failed opening required '".YCD_CONFIG_PATH."license.php'</span>";
		die();
	}
}
class CircleCountdown extends Countdown {

	public $expireSeconds;
	public $datesNumber;
	public function __construct() {
		add_action('add_meta_boxes', array($this, 'mainOptions'));
		add_action('ycdGeneralMetaboxes', array($this, 'metaboxes'), 10, 1);
		add_filter('ycdCountdownDefaultOptions', array($this, 'defaultOptions'), 1, 1);
	}

	public function defaultOptions($options) {
		return $options;
	}

	public function metaboxes($metaboxes) {
		$metaboxes[YCD_PROGRESS_METABOX_KEY] = array('title' => YCD_PROGRESS_METABOX_TITLE, 'position' => 'normal', 'prioritet' => 'high');
		return $metaboxes;
	}

	public function includeStyles() {
		$this->includeGeneralScripts();
		wp_enqueue_script('jquery');
		ScriptsIncluder::registerScript('ycdGoogleFonts.js');
		ScriptsIncluder::enqueueScript('ycdGoogleFonts.js');
		if(YCD_PKG_VERSION > YCD_FREE_VERSION) {
			ScriptsIncluder::registerScript('CountdownProFunctionality.js');
			ScriptsIncluder::enqueueScript('CountdownProFunctionality.js');
		}
		ScriptsIncluder::registerScript('Countdown.js');
		ScriptsIncluder::enqueueScript('Countdown.js');
		ScriptsIncluder::registerScript('TimeCircles.js');
		ScriptsIncluder::localizeScript('TimeCircles.js', 'YcdArgs', array('isAdmin' => is_admin()));
		ScriptsIncluder::enqueueScript('TimeCircles.js');
		ScriptsIncluder::registerStyle('TimeCircles.css');
		ScriptsIncluder::enqueueStyle('TimeCircles.css');
	}

	public function mainOptions(){
		parent::mainOptions();
		add_meta_box('ycdMainOptions', __('Countdown options', YCD_TEXT_DOMAIN), array($this, 'mainView'), YCD_COUNTDOWN_POST_TYPE, 'normal', 'high');
	}

	public function mainView() {
		$typeObj = $this;
		require_once YCD_VIEWS_PATH.'cricleMainView.php';
	}

	public function renderLivePreview() {
		$typeObj = $this;
	    require_once YCD_PREVIEW_VIEWS_PATH.'circlePreview.php';
    }

	public function prepareOptions() {
		$options = array();
		$modifiedObj = $this->getCircleSeconds();
		$modifiedSavedData = $modifiedObj->datesNumber;
		$options['ycd-seconds'] = $modifiedObj->expireSeconds;
		$options['ycd-countdown-date-type'] = $this->getOptionValue('ycd-countdown-date-type');
		$options['ycd-countdown-duration-hours'] = $this->getOptionValue('ycd-countdown-duration-hours');
		$options['ycd-countdown-duration-minutes'] = $this->getOptionValue('ycd-countdown-duration-minutes');
		$options['ycd-countdown-duration-seconds'] = $this->getOptionValue('ycd-countdown-duration-seconds');
		$options['animation'] = $this->getOptionValue('ycd-circle-animation');
		$options['direction'] = $this->getOptionValue('ycd-countdown-direction');
		$options['fg_width'] = $this->getOptionValue('ycd-circle-width');
		$options['bg_width'] = $this->getOptionValue('ycd-circle-bg-width');
		$options['start_angle'] = $this->getOptionValue('ycd-circle-start-angle');
		$options['count_past_zero'] = false;
		$options['circle_bg_color'] = $this->getOptionValue('ycd-countdown-bg-circle-color');
		$options['use_background'] = $this->getOptionValue('ycd-countdown-background-circle');
		$options['ycd-date-time-picker'] = $this->getOptionValue('ycd-date-time-picker');
		$options['ycd-circle-time-zone'] = $this->getOptionValue('ycd-circle-time-zone');
		$options['ycd-schedule-time-zone'] = $this->getOptionValue('ycd-schedule-time-zone');
		// Day numbers
		
		$options['startDay'] = $this->getOptionValue('ycd-schedule-start-day');
		$options['startDayNumber'] = $modifiedSavedData['startDayNumber'];
		$options['endDay'] = $this->getOptionValue('ycd-schedule-end-day');
		$options['endDayNumber'] = $modifiedSavedData['endDayNumber'];
		$options['currentDayNumber'] = $modifiedSavedData['currentDayNumber'];
		$options['ycd-schedule-end-to'] = $this->getOptionValue('ycd-schedule-end-to');
		$options['ycd-schedule-start-from'] = $this->getOptionValue('ycd-schedule-start-from');

		$options['time'] = array(
			'Years' => array(
				'text' =>  $this->getOptionValue('ycd-countdown-years-text'),
				'color' =>  $this->getOptionValue('ycd-countdown-years-color'),
				'show' => $this->getOptionValue('ycd-countdown-years')
			),
            'Months' => array(
				'text' => $this->getOptionValue('ycd-countdown-months-text'),
				'color' => $this->getOptionValue('ycd-countdown-months-color'),
				'show' => $this->getOptionValue('ycd-countdown-months')
			),
			'Days' => array(
				'text' =>  $this->getOptionValue('ycd-countdown-days-text'),
				'color' =>  $this->getOptionValue('ycd-countdown-days-color'),
				'show' => $this->getOptionValue('ycd-countdown-days')
			),
			'Hours' => array(
				'text' => $this->getOptionValue('ycd-countdown-hours-text'),
				'color' =>  $this->getOptionValue('ycd-countdown-hours-color'),
				'show' => $this->getOptionValue('ycd-countdown-hours')
			),
			'Minutes' => array(
				'text' => $this->getOptionValue('ycd-countdown-minutes-text'),
				'color' => $this->getOptionValue('ycd-countdown-minutes-color'),
				'show' => $this->getOptionValue('ycd-countdown-minutes')
			),
			'Seconds' => array(
				'text' => $this->getOptionValue('ycd-countdown-seconds-text'),
				'color' => $this->getOptionValue('ycd-countdown-seconds-color'),
				'show' => $this->getOptionValue('ycd-countdown-seconds')
			),
		);

		return $options;
	}

	public function getDataAllOptions() {
		$options = array();

		$options['ycd-countdown-expire-behavior'] = $this->getOptionValue('ycd-countdown-expire-behavior');
		$options['ycd-expire-text'] = $this->getOptionValue('ycd-expire-text');
		$options['ycd-expire-url'] = $this->getOptionValue('ycd-expire-url');
		$options['ycd-countdown-end-sound'] = $this->getOptionValue('ycd-countdown-end-sound');
		$options['ycd-countdown-end-sound-url'] = $this->getOptionValue('ycd-countdown-end-sound-url');

		return $options;
	}

	private function getBgImageStyleStr() {
        $imageUrl = $this->getOptionValue('ycd-bg-image-url');
        $bgImageSize = $this->getOptionValue('ycd-bg-image-size');
        $imageRepeat = $this->getOptionValue('ycd-bg-image-repeat');
        $styles = 'background-image: url('.$imageUrl.'); background-repeat: '.$imageRepeat.'; background-size: '.$bgImageSize.'; ';

        return $styles;
    }

    private function renderStyles() {
	    $id = $this->getId();
	    // text styles
	    $fontSize = $this->getOptionValue('ycd-text-font-size');
	    $fontWeight = $this->getOptionValue('ycd-countdown-font-weight');
	    $fontStyle = $this->getOptionValue('ycd-countdown-font-style');
	    $fontFamily = $this->getOptionValue('ycd-text-font-family');
	    // numbers styles
	    $fontSizeNumber = $this->getOptionValue('ycd-countdown-number-size');
	    $fontWeightNumber = $this->getOptionValue('ycd-countdown-number-font-weight');
	    $fontStyleNumber = $this->getOptionValue('ycd-countdown-number-font-style');
	    $fontFamilyNumber = $this->getOptionValue('ycd-countdown-number-font');
	    
	    $yearsColor = $this->getOptionValue('ycd-countdown-years-text-color');
	    $monthsColor = $this->getOptionValue('ycd-countdown-months-text-color');
	    $daysTextColor = $this->getOptionValue('ycd-countdown-days-text-color');
	    $hoursTextColor = $this->getOptionValue('ycd-countdown-hours-text-color');
	    $minutesTextColor = $this->getOptionValue('ycd-countdown-minutes-text-color');
	    $secondsTextColor = $this->getOptionValue('ycd-countdown-seconds-text-color');
	    $circleAlignment = $this->getOptionValue('ycd-circle-alignment');
	    $padding = $this->getOptionValue('ycd-countdown-padding').'px';

	    ob_start();
	    ?>
	    <style type="text/css">
            #ycd-circle-<?php echo $id; ?> {
                padding: <?php echo $padding; ?>;
                box-sizing: border-box;
                display: inline-block;
            }
            #ycd-circle-<?php echo $id; ?> h4 {
                font-size: <?php echo $fontSize; ?>px !important;
                font-weight: <?php echo $fontWeight; ?> !important;
                font-style: <?php echo $fontStyle; ?> !important;
                font-family: <?php echo $fontFamily; ?> !important;
            }
            #ycd-circle-<?php echo $id; ?> span {
                font-size: <?php echo $fontSizeNumber; ?>px !important;
                font-weight: <?php echo $fontWeightNumber; ?> !important;
                font-style: <?php echo $fontStyleNumber; ?> !important;
                font-family: <?php echo $fontFamilyNumber; ?> !important;
            }
            #ycd-circle-<?php echo $id; ?> .textDiv_Years h4,
            #ycd-circle-<?php echo $id; ?> .textDiv_Years span {

                color: <?php echo $yearsColor; ?>
            }
            #ycd-circle-<?php echo $id; ?> .textDiv_Months h4, 
            #ycd-circle-<?php echo $id; ?> .textDiv_Months span {
                color: <?php echo $monthsColor; ?>
            }
            #ycd-circle-<?php echo $id; ?> .textDiv_Days h4, 
            #ycd-circle-<?php echo $id; ?> .textDiv_Days span {
                color: <?php echo $daysTextColor; ?>
            }

            #ycd-circle-<?php echo $id; ?> .textDiv_Hours h4,
            #ycd-circle-<?php echo $id; ?> .textDiv_Hours span {
                color: <?php echo $hoursTextColor; ?>
            }

            #ycd-circle-<?php echo $id; ?> .textDiv_Minutes h4, 
            #ycd-circle-<?php echo $id; ?> .textDiv_Minutes span {
                color: <?php echo $minutesTextColor; ?>
            }

            #ycd-circle-<?php echo $id; ?> .textDiv_Seconds h4,
            #ycd-circle-<?php echo $id; ?> .textDiv_Seconds span {
                color: <?php echo $secondsTextColor; ?>
            }

            .ycd-time-circle {
                max-width: 100% !important;
            }
            
            .ycd-circle-<?php echo $id; ?>-wrapper {
                text-align: <?php echo $circleAlignment; ?>;
            }
        </style>
        <?php
	    $styles = ob_get_contents();
	    ob_get_clean();

	    echo $styles;
    }

	public function getViewContent() {
		$this->includeStyles();
        $id = $this->getId();

        $seconds = 0;
		
		$bgImageStyleStr = $this->getBgImageStyleStr();
		$bgImageStyleStr .= $this->renderStyles();
		$allDataOptions = $this->getDataAllOptions();
		$allDataOptions = json_encode($allDataOptions, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT);
		$prepareOptions = $this->prepareOptions();
		$prepareOptions = json_encode($prepareOptions, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT);
		$width = (int)$this->getOptionValue('ycd-countdown-width');
		$widthMeasure = $this->getOptionValue('ycd-dimension-measure');
		$width .= $widthMeasure;
		$content = '<div class="ycd-countdown-wrapper">';
		ob_start();
		?>
        <div class="ycd-circle-<?= $id; ?>-wrapper ycd-circle-wrapper">
            <div id="ycd-circle-<?= $id; ?>" class="ycd-time-circle" data-options='<?php echo $prepareOptions; ?>' data-all-options='<?php echo $allDataOptions; ?>' data-timer="<?php echo $seconds ?>" style="<?php echo $bgImageStyleStr ?> width: <?php echo $width; ?>; height: 100%; padding: 0; box-sizing: border-box; background-color: inherit"></div>
        </div>
		<?php
		$content .= ob_get_contents();
		ob_get_clean();
		$content .= $this->renderProgressBar();
		$content .= $this->renderSubscriptionForm();
		$content .= '</div>';

		return $content;
	}
}