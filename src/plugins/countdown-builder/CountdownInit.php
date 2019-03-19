<?php
namespace ycd;

class CountdownInit {

	private static $instance = null;
	private $actions;
	private $filters;

	private function __construct() {
		$this->init();
	}

	private function __clone() {
	}

	public static function getInstance() {
		if(!isset(self::$instance)) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function init() {
		register_activation_hook(YCD_PREFIX, array($this, 'activate'));
		$this->includeData();
		$this->actions();
		$this->filters();
	}

	private function includeData() {
		if(YCD_PKG_VERSION > YCD_FREE_VERSION) {
			require_once YCD_HELPERS_PATH.'AdminHelperPro.php';
			require_once YCD_HELPERS_PATH.'CheckerPro.php';
			require_once YCD_BLOCKS_PATH.'ProgressBar.php';
		}
		require_once(YCD_HELPERS_PATH.'ShowReviewNotice.php');
		require_once YCD_HELPERS_PATH.'HelperFunctions.php';
		require_once YCD_HELPERS_PATH.'ScriptsIncluder.php';
		require_once YCD_HELPERS_PATH.'MultipleChoiceButton.php';
		require_once YCD_HELPERS_PATH.'AdminHelper.php';
		require_once YCD_CLASSES_PATH.'Tickbox.php';
		require_once YCD_CLASSES_PATH.'YcdWidget.php';
		require_once YCD_CLASSES_PATH.'CountdownType.php';
		require_once YCD_COUNTDOWNS_PATH.'CountdownModel.php';
		if(YCD_PKG_VERSION > YCD_FREE_VERSION) {
			require_once YCD_CLASSES_PATH.'Checker.php';
		}
		require_once YCD_COUNTDOWNS_PATH.'Countdown.php';
		require_once YCD_CSS_PATH.'Css.php';
		require_once YCD_JS_PATH.'Js.php';
		require_once YCD_CLASSES_PATH.'RegisterPostType.php';
		if(YCD_PKG_VERSION > YCD_FREE_VERSION) {
			require_once YCD_CLASSES_PATH.'IncludeManager.php';
		}
		require_once YCD_CLASSES_PATH.'Actions.php';
		require_once YCD_CLASSES_PATH.'Ajax.php';
		require_once YCD_CLASSES_PATH.'Filters.php';
		require_once YCD_CLASSES_PATH.'Installer.php';
		if (YCD_PKG_VERSION > YCD_FREE_VERSION) {
			require_once YCD_CLASSES_PATH.'Subscription.php';
			require_once YCD_CLASSES_PATH.'AjaxPro.php';
			require_once YCD_CLASSES_PATH.'ActionsPro.php';
			require_once YCD_CLASSES_PATH.'FiltersPro.php';
		}
	}

	public function actions() {
		$this->actions = new Actions();
	}

	public function filters() {
		$this->filters = new Filters();
	}

	public function activate() {
		Installer::install();
	}
}

CountdownInit::getInstance();