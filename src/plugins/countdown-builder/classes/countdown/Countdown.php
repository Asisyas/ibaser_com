<?php
namespace ycd;
use \YcdCountdownOptionsConfig;
use \DateTime;
use \DateTimeZone;

abstract class Countdown {

	private $id;
	private $type;
	private $title;
	private $savedData;
	private $sanitizedData;
	private $shortCodeArgs;
	private $shortCodeContent;
	private $isCountdown = true;

	//expire seconds
	public $expireSeconds = 0;

	abstract protected function getViewContent();

	public function setId($id) {
		$this->id = $id;
	}

	public function getId() {
		return (int)$this->id;
	}
	
	public function setIsCountdown($isCountdown) {
		$this->isCountdown = $isCountdown;
	}

	public function getIsCountdown() {
		return (bool)$this->isCountdown;
	}

	public function setType($type) {
		$this->type = $type;
	}

	public function getType() {
		return $this->type;
	}
	
	public function getTypeTitle() {
		$type = $this->getType();
		global $YCD_TYPES;
		$titles = $YCD_TYPES['titles'];
		
		$typeTitle = (isset($titles[$type])) ? $titles[$type] : __('Unknown Type', YCD_TEXT_DOMAIN);
		
		return $typeTitle;
	}

	public function allowToShowExpiration() {
		$status = true;
		$countdownDateType = $this->getOptionValue('ycd-countdown-date-type');

		if(!empty($countdownDateType) && $countdownDateType == 'duration') {
			return false;
		}

		return $status;
	}

	public function setTitle($title) {
		$this->title = $title;
	}

	public function getTitle() {
		return $this->title;
	}

	public function setShortCodeContent($shortCodeContent) {
		$this->shortCodeContent = $shortCodeContent;
	}

	public function getShortCodeContent() {
		return $this->shortCodeContent;
	}

	public function setShortCodeArgs($shortCodeArgs) {
		$this->shortCodeArgs = $shortCodeArgs;
	}

	public function getShortCodeArgs() {
		return $this->shortCodeArgs;
	}

	public function setSavedData($savedData) {
		$this->savedData = $savedData;
	}

	public function getSavedData() {
		return $this->savedData;
	}

	public function setExpireSeconds($expireSeconds) {
		$this->expireSeconds = $expireSeconds;
	}

	public function getExpireSeconds() {
		return $this->expireSeconds;
	}

	public function insertIntoSanitizedData($sanitizedData) {
		if (!empty($sanitizedData)) {
			$this->sanitizedData[$sanitizedData['name']] = $sanitizedData['value'];
		}
	}

	public function getSanitizedData() {
		return $this->sanitizedData;
	}
	
	public function getMetaBoxes()
	{
		$metaboxes = $this->defaultMainMetaboxes();
		
		return apply_filters('ycdGeneralMetaboxes', $metaboxes);
	}
	
	public function includeGeneralScripts() {
		ScriptsIncluder::registerScript('moment.js', array('dirUrl' => YCD_COUNTDOWN_JS_URL));
		ScriptsIncluder::enqueueScript('moment.js');
	}

	public static function create($data = array()) {
		$obj = new static();
		$id = $data['ycd-post-id'];
		$obj->setId($id);

		// set up apply filter
		YcdCountdownOptionsConfig::optionsValues();
		foreach ($data as $name => $value) {
			$defaultData = $obj->getDefaultDataByName($name);
			if (empty($defaultData['type'])) {
				$defaultData['type'] = 'string';
			}
			$sanitizedValue = $obj->sanitizeValueByType($value, $defaultData['type']);
			$obj->insertIntoSanitizedData(array('name' => $name,'value' => $sanitizedValue));
		}

		$result = $obj->save();
	}

	public function save() {
		$options = $this->getSanitizedData();
		$postId = $this->getId();

		update_post_meta($postId, 'ycd_options', $options);
	}

	public function sanitizeValueByType($value, $type) {
		switch ($type) {
			case 'string':
			case 'number':
				$sanitizedValue = sanitize_text_field($value);
				break;
			case 'html':
				$sanitizedValue = $value;
				break;
			case 'array':
				$sanitizedValue = $this->recursiveSanitizeTextField($value);
				break;
			case 'email':
				$sanitizedValue = sanitize_email($value);
				break;
			case "checkbox":
				$sanitizedValue = sanitize_text_field($value);
				break;
			default:
				$sanitizedValue = sanitize_text_field($value);
				break;
		}

		return $sanitizedValue;
	}

	public function recursiveSanitizeTextField($array) {
		if (!is_array($array)) {
			return $array;
		}

		foreach ($array as $key => &$value) {
			if (is_array($value)) {
				$value = $this->recursiveSanitizeTextField($value);
			}
			else {
				/*get simple field type and do sensitization*/
				$defaultData = $this->getDefaultDataByName($key);
				if (empty($defaultData['type'])) {
					$defaultData['type'] = 'string';
				}
				$value = $this->sanitizeValueByType($value, $defaultData['type']);
			}
		}

		return $array;
	}

	public function getDefaultDataByName($optionName) {
		global $YCD_OPTIONS;

		if(empty($YCD_OPTIONS)) {
			return array();
		}
		foreach ($YCD_OPTIONS as $option) {
			if ($option['name'] == $optionName) {
				return $option;
			}
		}

		return array();
	}

	public function getDefaultValue($optionName) {

		if (empty($optionName)) {
			return '';
		}

		$defaultData = $this->getDefaultDataByName($optionName);

		if (empty($defaultData['defaultValue'])) {
			return '';
		}

		return $defaultData['defaultValue'];
	}

	public function isAllowOption($optionName) {
		if(YCD_PKG_VERSION == YCD_FREE_VERSION) {
			return true;
		}
		$defaultData = $this->getDefaultDataByName($optionName);

		if(empty($defaultData['available'])) {
			return true;
		}

		return YCD_PKG_VERSION >= $defaultData['available'];
	}

	public static function parseCountdownDataFromData($data) {
		$cdData = array();

		foreach ($data as $key => $value) {
			if (strpos($key, 'ycd') === 0) {
				$cdData[$key] = $value;
			}
		}

		return $cdData;
	}

	public static function getClassNameCountdownType($type) {
		$typeName = ucfirst(strtolower($type));
		$className = $typeName.'Countdown';

		return $className;
	}

	public static function getTypePathFormCountdownType($type) {
		global $YCD_TYPES;
		$typePath = '';

		if (!empty($YCD_TYPES['typePath'][$type])) {
			$typePath = $YCD_TYPES['typePath'][$type];
		}

		return $typePath;
	}

	/**
	 * Get option value from name
	 * @since 1.0.0
	 *
	 * @param string $optionName
	 * @param bool $forceDefaultValue
	 * @return string
	 */
	public function getOptionValue($optionName, $forceDefaultValue = false) {
		$savedData = CountdownModel::getDataById($this->getId());
		$this->setSavedData($savedData);

		return $this->getOptionValueFromSavedData($optionName, $forceDefaultValue);
	}

	public function getOptionValueFromSavedData($optionName, $forceDefaultValue = false) {
		
		$defaultData = $this->getDefaultDataByName($optionName);
		$savedData = $this->getSavedData();
		
		$optionValue = null;

		if (empty($defaultData['type'])) {
			$defaultData['type'] = 'string';
		}

		if (!empty($savedData)) { //edit mode
			if (isset($savedData[$optionName])) { //option exists in the database
				$optionValue = $savedData[$optionName];
			}
			/* if it's a checkbox, it may not exist in the db
			 * if we don't care about it's existence, return empty string
			 * otherwise, go for it's default value
			 */
			else if ($defaultData['type'] == 'checkbox' && !$forceDefaultValue) {
				$optionValue = '';
			}
		}

		if (($optionValue === null && !empty($defaultData['defaultValue'])) || ($defaultData['type'] == 'number' && !isset($optionValue))) {
			$optionValue = $defaultData['defaultValue'];
		}

		if ($defaultData['type'] == 'checkbox') {
			$optionValue = $this->boolToChecked($optionValue);
		}

		if(isset($defaultData['ver']) && $defaultData['ver'] > YCD_PKG_VERSION) {
			if (empty($defaultData['allow'])) {
				return $defaultData['defaultValue'];
			}
			else if (!in_array($optionValue, $defaultData['allow'])) {
				return $defaultData['defaultValue'];
			}
		}

		return $optionValue;
	}

	public static function getPostSavedData($postId) {
		$savedData = get_post_meta($postId, 'ycd_options');

		if (empty($savedData)) {
			return $savedData;
		}
		$savedData = $savedData[0];

		return $savedData;
	}

	/**
	 * Returns separate countdown types Free or Pro
	 *
	 * @since 1.0.0
	 *
	 * @return array $countdownType
	 */
	public static function getCountdownTypes() {
		global $YCD_TYPES;
		$countdownTypesObj = array();
		$countdownTypes = $YCD_TYPES['typeName'];

		foreach($countdownTypes as $type => $level) {
			if(empty($level)) {
				$level = YCD_FREE_VERSION;
			}
			$typeObj = new CountdownType();
			$typeObj->setName($type);
			$typeObj->setAccessLevel($level);

			if(YCD_PKG_VERSION >= $level) {
				$typeObj->setAvailable(true);
			}
			$countdownTypesObj[] = $typeObj;
		}

		return $countdownTypesObj;
	}

	public static function find($id) {
		$options = CountdownModel::getDataById($id);

		if(empty($options)) {
			return false;
		}
		$type = $options['ycd-type'];

		$typePath = self::getTypePathFormCountdownType($type);
		$className = self::getClassNameCountdownType($type);

		if (!file_exists($typePath.$className.'.php')) {
			return false;
		}

		require_once($typePath.$className.'.php');
		$className = __NAMESPACE__.'\\'.$className;
		$postTitle = get_the_title($id);

		$typeObj = new $className();
		$typeObj->setId($id);
		$typeObj->setType($type);
		$typeObj->setTitle($postTitle);
		$typeObj->setSavedData($options);

		return $typeObj;
	}
	
	public function defaultMainMetaboxes() {
		$metaboxes = array();
	
		$metaboxes['advancedOptions'] = array('title' => 'Advanced Options', 'position' => 'normal', 'prioritet' => 'high');
		$metaboxes['generalOptions'] = array('title' => 'General Options', 'position' => 'normal', 'prioritet' => 'high');
		$metaboxes['subscription'] = array('title' => 'Subscription Section', 'position' => 'normal', 'prioritet' => 'high');
		$metaboxes['afterCountdownExpire'] = array('title' => 'After Expire', 'position' => 'normal', 'prioritet' => 'high');
	
		return $metaboxes;
	}
	
	public function mainOptions() {
		$proLabel = '';

		if (YCD_PKG_VERSION == YCD_FREE_VERSION) {
			$proLabel = '<span class="ycd-pro-span"><b>'.__('pro', YCD_TEXT_DOMAIN).'</b></span>';
		}
		$metaboxes = $this->getMetaBoxes();
		
		foreach ($metaboxes as $key => $metabox) {
			add_meta_box($key, __($metabox['title'], YCD_TEXT_DOMAIN), array($this, $key), YCD_COUNTDOWN_POST_TYPE, $metabox['position'], $metabox['prioritet']);
		}
	}

	public function afterCountdownExpire() {
		require_once YCD_VIEWS_PATH.'afterExpire.php';
	}
	
	public function advancedOptions() {
		require_once YCD_VIEWS_PATH.'advancedOptions.php';
	}

	public function generalOptions() {
		require_once YCD_VIEWS_PATH.'generalOptions.php';
	}

	public function subscription() {
		require_once YCD_VIEWS_PATH.'subscriptionSection.php';
	}

	public function ycdMetaboxProgress() {
		require_once YCD_VIEWS_PATH.'progressBar.php';
	}

	public static function isActivePost($postId) {
		$enabled = !get_post_meta($postId, 'ycd_enable', true);
		$postStatus = get_post_status($postId);

		return ($enabled && $postStatus == 'publish');
	}

	public function boolToChecked($var) {
		return ($var ? 'checked' : '');
	}

	public static function getCountdownsObj($agrs = array()) {
		$postStatus = array('publish');
		$countdowns = array();

		if (!empty($agrs['postStatus'])) {
			$postStatus = $agrs['postStatus'];
		}

		$posts = get_posts(array(
			'post_type' => YCD_COUNTDOWN_POST_TYPE,
			'post_status' => $postStatus,
			'numberposts' => -1
			// 'order'	=> 'ASC'
		));

		if(empty($posts)) {
			return $countdowns;
		}

		foreach ($posts as $post) {
			$countdownObj = self::find($post->ID);

			if(empty($countdownObj)) {
				continue;
			}
			$countdowns[] = $countdownObj;
		}

		return $countdowns;
	}

	public static function shapeIdTitleData($contdowns = false) {

		if (empty($contdowns)) {
			$contdowns = self::getCountdownsObj();
		}
		$idTitle = array();

		if(empty($contdowns)) {
			return $idTitle;
		}

		foreach ($contdowns as $countdown) {
			$title = $countdown->getTitle();
			$id = $countdown->getId();
			$isActive = Countdown::isActivePost($id);

			if(!$isActive) {
				continue;
			}
			if(empty($title)) {
				$title = __('(no title)', YCD_TEXT_DOMAIN);
			}

			$idTitle[$id] = $title .' - '. $countdown->getTypeTitle();
		}

		return $idTitle;
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

	public function renderSubscriptionForm() {
		if (!$this->getOptionValue('ycd-enable-subscribe-form')) {
			return '';
		}
		$args = array(
			'width' => $this->getOptionValue('ycd-subscribe-width')	,
			'aboveText' => $this->getOptionValue('ycd-form-above-text'),
			'inputText' => $this->getOptionValue('ycd-form-input-text'),
			'submitText' => $this->getOptionValue('ycd-form-submit-text'),
			'submitButtonColor' => $this->getOptionValue('ycd-form-submit-color'),
			'successMessage' => $this->getOptionValue('ycd-subscribe-success-message'),
			'emailMessage' => $this->getOptionValue('ycd-subscribe-error-message'),
			'id' => $this->getId()
		);

		$subscription = new Subscription();
		$subscription->setOptions($args);

		return $subscription->render();
	}

	public function renderProgressBar() {
		if(!$this->getOptionValue('ycd-countdown-enable-progress')) {
			return '';
		}
		$allSecondsArgs = array(
			'dateType' => $this->getOptionValue('ycd-countdown-date-type'),
			'timePicker' => $this->getOptionValue('ycd-date-time-picker'),
			'timeZone' => $this->getOptionValue('ycd-circle-time-zone'),
			'durationHours' => (int)$this->getOptionValue('ycd-countdown-duration-hours'),
			'minutes' => (int)$this->getOptionValue('ycd-countdown-duration-minutes'),
			'secondsSaved' => (int)$this->getOptionValue('ycd-countdown-duration-seconds')
		);
		$allSeconds =  $this->gettProgressAllSeconds();
		$currentSeconds =  $this->getProgressCurrentSeconds();

		$args = array(
			'id' => $this->getId(),
			'allSeconds' => $allSeconds,
			'currentSeconds' => $currentSeconds,
			'width' => $this->getOptionValue('ycd-progress-width'),
			'height' => $this->getOptionValue('ycd-progress-height'),
			'type' => $this->getOptionValue('ycd-countdown-date-type'),
			'mainColor' => $this->getOptionValue('ycd-progress-main-color'),
			'progressColor' => $this->getOptionValue('ycd-progress-color'),
			'textColor' => $this->getOptionValue('ycd-progress-text-color')
		);
	
		return Countdown::renderProgress($args);
	}

	public static function renderProgress($args = array()) {
		$progressBar = new ProgressBar();
		$progressBar->setOptions($args);

		return $progressBar;
	}

	private function gettProgressAllSeconds($args = array()) {
		$seconds = 0;
		$filteredObj = $this;
		$countdownType = $this->getType();
		$dateType = $this->getOptionValue('ycd-countdown-date-type');
		$timePicker = $this->getOptionValue('ycd-date-time-picker');
		$timeZone = $this->getOptionValue('ycd-circle-time-zone');
		$durationHours = (int)$this->getOptionValue('ycd-countdown-duration-hours');
		$minutes = (int)$this->getOptionValue('ycd-countdown-duration-minutes');
		$secondsSaved = (int)$this->getOptionValue('ycd-countdown-duration-seconds');

		$dateType = $dateType;

		if($dateType == 'dueDate') {
			$dueDate = $timePicker;
			$timezone = $timeZone;
			$dueDate .= ':00';
			$timeDate = new DateTime('now', new DateTimeZone($timezone));
			$timeNow = strtotime($timeDate->format('Y-m-d H:i:s'));
			$seconds = strtotime($dueDate)-$timeNow;
		}
		else if($dateType == 'schedule') {
			$filteredObj = apply_filters('ycdScheduleExpireSecond', $this);
			$seconds = $this->getExpireSeconds();
		}
		else {
			$hours = $durationHours;
			$minutes = $minutes;
			$secondsSaved = $secondsSaved;

			$seconds = $hours*60*60 + $minutes*60 + $secondsSaved;
		}

		if($countdownType == 'timer') {
			$hours = $this->getOptionValue('ycd-timer-hours');
			$minutes = $this->getOptionValue('ycd-timer-minutes');
			$secondsSaved = $this->getOptionValue('ycd-timer-seconds');

			$seconds = $hours*60*60 + $minutes*60 + $secondsSaved;
		}
		
		return $seconds;
	}

	private function getProgressCurrentSeconds() {
		$seconds = 0;
		$countdownType = $this->getType();
		$filteredObj = $this;
		$dateType = $this->getOptionValue('ycd-countdown-date-type');
		$startDate = $this->getOptionValue('ycd-date-progress-start-date');
		$timePicker = $this->getOptionValue('ycd-date-time-picker');
		$timezone = $this->getOptionValue('ycd-circle-time-zone');
		$durationHours = (int)$this->getOptionValue('ycd-countdown-duration-hours');
		$minutes = (int)$this->getOptionValue('ycd-countdown-duration-minutes');
		$secondsSaved = (int)$this->getOptionValue('ycd-countdown-duration-seconds');

		$dateType = $dateType;

		if($dateType == 'dueDate') {
			$dueDate = $startDate;
			$endDate = $timePicker;
			$timezone = $timezone;
			$dueDate .= ':00';
			$timeDate = new DateTime('now', new DateTimeZone($timezone));
			$timeNow = strtotime($timeDate->format('Y-m-d H:i:s'));
			$seconds = strtotime($endDate)-strtotime($dueDate);
		}
		else if($dateType == 'schedule') {
			 $filteredObj = apply_filters('ycdScheduleAllSeconds', $this);
			 $seconds = $this->getExpireSeconds();
		}
		else {
			$hours = $durationHours;
			$minutes = $minutes;
			$secondsSaved = $secondsSaved;

			$seconds = $hours*60*60 + $minutes*60 + $secondsSaved;
		}

		if($countdownType == 'timer') {
			$hours = $this->getOptionValue('ycd-timer-hours');
			$minutes = $this->getOptionValue('ycd-timer-minutes');
			$secondsSaved = $this->getOptionValue('ycd-timer-seconds');

			$seconds = $hours*60*60 + $minutes*60 + $secondsSaved;
		}

		return $seconds;
	}
	
	/**
	 * Changing default options form changing options by name
	 *
	 * @since 1.0.0
	 *
	 * @param array $defaultOptions
	 * @param array $changingOptions
	 *
	 * @return array $defaultOptions
	 */
	public function changeDefaultOptionsByNames($defaultOptions, $changingOptions)
	{
		if (empty($defaultOptions) || empty($changingOptions)) {
			return $defaultOptions;
		}
		$changingOptionsNames = array_keys($changingOptions);
		
		foreach ($defaultOptions as $key => $defaultOption) {
			$defaultOptionName = $defaultOption['name'];
			if (in_array($defaultOptionName, $changingOptionsNames)) {
				$defaultOptions[$key] = $changingOptions[$defaultOptionName];
			}
		}
		
		return $defaultOptions;
	}

	public function getCurrentTypeFromOptions() {
		$type = $this->getOptionValue('ycd-type');
		if(!empty($_GET['ycd_type'])) {
			$type = $_GET['ycd_type'];
		}

        return $type;
	}
	
	public function isExpired() {
		$dateType = $this->getOptionValue('ycd-countdown-date-type');

		$timezone = $this->getOptionValue('ycd-circle-time-zone');
		$dueDate = $this->getOptionValue('ycd-date-time-picker');
		$dueDate .= ':00';
		$timeDate = new DateTime('now', new DateTimeZone($timezone));
		$timeNow = strtotime($timeDate->format('Y-m-d H:i:s'));
		$seconds = strtotime($dueDate)-$timeNow;

		if($dateType == 'schedule') {
			$seconds = $this->getCircleSeconds();
			return !$seconds->expireSeconds;
		}
		
		return ($seconds < 0);
	}

	public function getExpireDate() {
		$dateType = $this->getOptionValue('ycd-countdown-date-type');

		$timezone = $this->getOptionValue('ycd-circle-time-zone');
		$current = new DateTime('now', new \DateTimeZone($timezone));
		$dueDate = $this->getOptionValue('ycd-date-time-picker');
		$currentDate = $current->format('Y-m-d H:i:s');
		if($dateType == 'schedule') {
			$timezone = $this->getOptionValue('ycd-schedule-time-zone');

			$current = new DateTime('now', new DateTimeZone($timezone));
			$currentDate = $current->format('Y-m-d H:i:s');

			$endTo = $this->getOptionValue('ycd-schedule-end-day');
			$endTimeClock = $this->getOptionValue('ycd-schedule-end-to');
			$endDateObj = AdminHelperPro::getSheduleDate($endTo, $endTimeClock, $timezone);
			$dueDate = $endDateObj->format('Y-m-d H:i:s');
		}
		$dateString = human_time_diff(strtotime($dueDate), strtotime($currentDate));

		return $dateString;
	}
	
	public static function allowToLoad($contdownPost, $countdownObj) {
		$isAllow = Checker::isAllow($contdownPost, $countdownObj);
		
		return $isAllow;
	}

	protected function getCircleSeconds() {
		$seconds = 0;
		$filteredObj = $this;
		$dateType = $this->getOptionValue('ycd-countdown-date-type');

		if($dateType == 'dueDate') {
			$dueDate = $this->getOptionValue('ycd-date-time-picker');
			$timezone = $this->getOptionValue('ycd-circle-time-zone');
			$dueDate .= ':00';
			$timeDate = new DateTime('now', new DateTimeZone($timezone));
			$timeNow = strtotime($timeDate->format('Y-m-d H:i:s'));
			$seconds = strtotime($dueDate)-$timeNow;
		}
		else if($dateType == 'schedule') {
			$filteredObj = apply_filters('ycdScheduleExpireSecond', $this);
			$seconds = $this->getExpireSeconds();
		}
		else {
			$hours = (int)$this->getOptionValue('ycd-countdown-duration-hours');
			$minutes = (int)$this->getOptionValue('ycd-countdown-duration-minutes');
			$secondsSaved = (int)$this->getOptionValue('ycd-countdown-duration-seconds');

			$seconds = $hours*60*60 + $minutes*60 + $secondsSaved;
		}
		$filteredObj->expireSeconds = $seconds;

		return $filteredObj;
	}

	protected function scheduleOptions(&$options) {
		$modifiedObj = $this->getCircleSeconds();
		$modifiedSavedData = $modifiedObj->datesNumber;
		
		$options['startDay'] = $this->getOptionValue('ycd-schedule-start-day');
		$options['startDayNumber'] = $modifiedSavedData['startDayNumber'];
		$options['endDay'] = $this->getOptionValue('ycd-schedule-end-day');
		$options['endDayNumber'] = $modifiedSavedData['endDayNumber'];
		$options['currentDayNumber'] = $modifiedSavedData['currentDayNumber'];
		$options['ycd-schedule-end-to'] = $this->getOptionValue('ycd-schedule-end-to');
		$options['ycd-schedule-start-from'] = $this->getOptionValue('ycd-schedule-start-from');
		$options['ycd-schedule-time-zone'] = $this->getOptionValue('ycd-schedule-time-zone');
	}
}