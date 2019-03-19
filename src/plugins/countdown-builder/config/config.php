<?php

class YcdCountdownConfig {
    public static function addDefine($name, $value) {
        if(!defined($name)) {
            define($name, $value);
        }
    }

    public static function init() {
        self::addDefine('YCD_PREFIX', YCD_FILE_NAME);
        self::addDefine('YCD_ADMIN_URL', admin_url());
        self::addDefine('YCD_COUNTDOWN_BUILDER_URL', plugins_url().'/'.YCD_FOLDER_NAME.'/');
        self::addDefine('YCD_COUNTDOWN_ADMIN_URL', admin_url());
        self::addDefine('YCD_COUNTDOWN_URL', plugins_url().'/'.YCD_FOLDER_NAME.'/');
        self::addDefine('YCD_COUNTDOWN_ASSETS_URL', YCD_COUNTDOWN_URL.'assets/');
        self::addDefine('YCD_COUNTDOWN_CSS_URL', YCD_COUNTDOWN_ASSETS_URL.'css/');
        self::addDefine('YCD_COUNTDOWN_JS_URL', YCD_COUNTDOWN_ASSETS_URL.'js/');
        self::addDefine('YCD_COUNTDOWN_ADMIN_JS_URL', YCD_COUNTDOWN_JS_URL.'admin/');
        self::addDefine('YCD_COUNTDOWN_IMG_URL', YCD_COUNTDOWN_ASSETS_URL.'img/');
        self::addDefine('YCD_COUNTDOWN_LIB_URL', YCD_COUNTDOWN_URL.'lib/');
        self::addDefine('YCD_COUNTDOWN_PATH', WP_PLUGIN_DIR.'/'.YCD_FOLDER_NAME.'/');
        self::addDefine('YCD_CLASSES_PATH', YCD_COUNTDOWN_PATH.'classes/');
        self::addDefine('YCD_BLOCKS_PATH', YCD_CLASSES_PATH.'blocks/');
        self::addDefine('YCD_DATA_TABLE_PATH', YCD_CLASSES_PATH.'dataTable/');
        self::addDefine('YCD_LIB_PATH', YCD_COUNTDOWN_PATH.'lib/');
        self::addDefine('YCD_HELPERS_PATH', YCD_COUNTDOWN_PATH.'helpers/');
        self::addDefine('YCD_CONFIG_PATH', YCD_COUNTDOWN_PATH.'config/');
        self::addDefine('YCD_ASSETS_PATH', YCD_COUNTDOWN_PATH.'/assets/');
        self::addDefine('YCD_VIEWS_PATH', YCD_ASSETS_PATH.'views/');
        self::addDefine('YCD_VIEWS_MAIN_PATH', YCD_VIEWS_PATH.'main/');
        self::addDefine('YCD_PREVIEW_VIEWS_PATH', YCD_VIEWS_PATH.'preview/');
        self::addDefine('YCD_CSS_PATH', YCD_ASSETS_PATH.'css/');
        self::addDefine('YCD_JS_PATH', YCD_ASSETS_PATH.'js/');
        self::addDefine('YCD_COUNTDOWNS_PATH', YCD_CLASSES_PATH.'countdown/');
        self::addDefine('YCD_HELPERS_PATH', YCD_COUNTDOWN_PATH.'helpers/');
        self::addDefine('YCD_COUNTDOWN_POST_TYPE', 'ycdcountdown');
        self::addDefine('YCD_COUNTDOWN_SETTINGS', 'ycdSettings');
        self::addDefine('YCD_COUNTDOWN_SUPPORT', 'supports');
        self::addDefine('YCD_COUNTDOWN_NEWSLETTER', 'ycdNewsletter');
        self::addDefine('YCD_COUNTDOWN_SUBSCRIBERS', 'ycdSubscribers');
	    self::addDefine('YCD_POSTS_TABLE_NAME', 'posts');
        self::addDefine('YCD_COUNTDOWN_SUBSCRIBERS_TABLE', 'ycd_subscribers');
        self::addDefine('YCD_COUNTDOWN_WIDGET', 'ycd_countdown_widget');
        self::addDefine('YCD_TEXT_DOMAIN', 'ycdCountdown');
        self::addDefine('YCD_COUNTDOWN_PRO_URL', 'https://edmonsoft.com/countdown');
        self::addDefine('YCD_COUNTDOWN_REVIEW_URL', 'https://wordpress.org/support/plugin/countdown-builder/reviews/?filter=5');
        self::addDefine('YCD_PROGRESS_METABOX_KEY', 'ycdMetaboxProgress');
        self::addDefine('YCD_PROGRESS_METABOX_TITLE', __('Progress Bar', YCD_TEXT_DOMAIN));
        self::addDefine('YCD_FILTER_REPEAT_INTERVAL', 50);
        self::addDefine('YCD_SHOW_REVIEW_PERIOD', 30);
	    self::addDefine('YCD_PRODUCTS_LIMIT', 1000);
        self::addDefine('YCD_CRON_REPEAT_INTERVAL', 1);
	    self::addDefine('YCD_AJAX_SUCCESS', 1);
	    self::addDefine('YCD_TABLE_LIMIT', 15);
        self::addDefine('YCD_VERSION', 1.39);
        self::addDefine('YCD_VERSION_PRO', 1.25);
        self::addDefine('YCD_FREE_VERSION', 1);
        self::addDefine('YCD_SILVER_VERSION', 2);
        self::addDefine('YCD_GOLD_VERSION', 3);
        self::addDefine('YCD_PLATINUM_VERSION', 4);
        require_once(dirname(__FILE__).'/config-pkg.php');
    }

    public static function getVersionString() {
	    $version = 'YCD_VERSION='.YCD_VERSION;
	    if(YCD_PKG_VERSION > YCD_FREE_VERSION) {
		    $version = 'YCD_VERSION_PRO=' . YCD_VERSION_PRO.";";
	    }

	    return $version;
    }

    public static function headerScript() {
		$version = self::getVersionString();

		ob_start();
		?>
			<script type="text/javascript">
				<?= $version; ?>
			</script>
	    <?php
	    $content = ob_get_contents();
	    ob_get_clean();

	    return $content;
    }
}

YcdCountdownConfig::init();
