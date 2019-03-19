<?php
namespace ycd;
use \YcdCountdownOptionsConfig;
use \YcdShowReviewNotice;

class Actions {
	public $customPostTypeObj;
	private $isLoadedMediaData = false;

	public function isLoadedMediaData() {
		return $this->isLoadedMediaData;
	}

	public function setIsLoadedMediaData($isLoadedMediaData) {
		$this->isLoadedMediaData = $isLoadedMediaData;
	}

	public function __construct() {
		$this->init();
	}

	public function init() {
		add_action('admin_init', array($this, 'userRolesCaps'));
		add_action('init', array($this, 'postTypeInit'));
		add_action('admin_menu', array($this, 'addSubMenu'));
		add_action('save_post', array($this, 'savePost'), 10, 3);
		add_shortcode('ycd_countdown', array($this, 'shortcode'));
		add_action('manage_'.YCD_COUNTDOWN_POST_TYPE.'_posts_custom_column' , array($this, 'tableColumnValues'), 10, 2);
		add_action('add_meta_boxes', array($this, 'generalOptions'));
		add_action('widgets_init', array($this, 'loadWidgets'));
		add_action('media_buttons', array($this, 'ycdMediaButton'), 11);
		add_action('admin_post_ycdSaveSettings', array($this, 'saveSettings'), 10, 1);
		add_action('wp_head', array($this, 'wpHead'), 10, 1);
		if (YCD_PKG_VERSION == YCD_FREE_VERSION) {
			add_action('admin_head', array($this, 'adminHead'));
		}
		add_action('wp_enqueue_scripts', array($this, 'enqueueScripts'));
		add_filter('mce_external_plugins', array($this, 'editirButton'));
	}

	public function editirButton( $buttons) {
		$isLoadedMediaData = $this->isLoadedMediaData();
		new Tickbox(true, $isLoadedMediaData);
		$buttons['countdownBuilder'] = plugins_url( '/../assets/js/admin/ycd-tinymce-plugin.js',__FILE__ );

		return $buttons;
	}
	
	public function enqueueScripts() {
		if(YCD_PKG_VERSION > YCD_FREE_VERSION) {
   			$includeManager = new IncludeManager();
		}
    }
	
	public function adminHead() {
		$script =  '<script>';
		$script .= "jQuery(document).ready(function() {jQuery('[href*=\"ycdSubscribers\"]').attr(\"href\", '".YCD_COUNTDOWN_PRO_URL."').attr('target', '_blank');jQuery('[href*=\"ycdNewsletter\"]').attr(\"href\", '".YCD_COUNTDOWN_PRO_URL."').attr('target', '_blank')});";
		$script .= '</script>';
		
		echo $script;
	}

	public static function wpHead() {
	    echo \YcdCountdownConfig::headerScript();
    }

	public function userRolesCaps() {
	    $userSavedRoles = AdminHelper::getCountdownPostAllowedUserRoles();

		foreach ($userSavedRoles as $theRole) {
			$role = get_role($theRole);
			;
			$role->add_cap('read');
			$role->add_cap('read_post');
			$role->add_cap('read_private_ycd_countdowns');
			$role->add_cap('edit_ycd_countdown');
			$role->add_cap('edit_ycd_countdowns');
			$role->add_cap('edit_others_ycd_countdowns');
			$role->add_cap('edit_published_ycd_countdowns');
			$role->add_cap('publish_ycd_countdowns');
			$role->add_cap('delete_ycd_countdowns');
			$role->add_cap('delete_published_posts');
			$role->add_cap('delete_others_ycd_countdowns');
			$role->add_cap('delete_private_ycd_countdowns');
			$role->add_cap('delete_private_ycd_countdown');
			$role->add_cap('delete_published_ycd_countdowns');

			// For countdown builder sub-menus and terms
			$role->add_cap('ycd_manage_options');
		}

		return true;
	}


	function ycdMediaButton() {
		$this->setIsLoadedMediaData(true);
	    new Tickbox();
	}

	public function loadWidgets() {
		register_widget('ycd_countdown_widget');
    }

	public function postTypeInit() {
		$this->revieNotice();
		$this->customPostTypeObj = new RegisterPostType();
	}

	private function revieNotice() {
		add_action('admin_notices', array($this, 'showReviewNotice'));
		add_action('network_admin_notices', array($this, 'showReviewNotice'));
		add_action('user_admin_notices', array($this, 'showReviewNotice'));
	}

	public function showReviewNotice() {
		echo new YcdShowReviewNotice();
	}

	public function addSubMenu() {
		$this->customPostTypeObj->addSubMenu();
	}

	public function savePost($postId, $post, $update) {
		if(!$update) {
			return false;
		}
		$postData = Countdown::parseCountdownDataFromData($_POST);
		$postData = apply_filters('ycdSavedData', $postData);
		if(empty($postData)) {
			return false;
		}
		$postData['ycd-post-id'] = $postId;

		if (!empty($postData['ycd-type'])) {
			$type = $postData['ycd-type'];
			$typePath = Countdown::getTypePathFormCountdownType($type);
			$className = Countdown::getClassNameCountdownType($type);

			require_once($typePath.$className.'.php');
			$className = __NAMESPACE__.'\\'.$className;

			$className::create($postData);
		}

		return true;
	}

	public function shortcode($args, $content) {
		YcdCountdownOptionsConfig::optionsValues();

		$id = $args['id'];

		if(empty($id)) {
			return '';
		}
		$typeObj = Countdown::find($id);
		$isActive = Countdown::isActivePost($id);

		if (empty($typeObj) || !$isActive) {
			return '';
		}

		$typeObj->setShortCodeArgs($args);
		$typeObj->setShortCodeContent($content);

		if(YCD_PKG_VERSION > YCD_FREE_VERSION) {
			if(!CheckerPro::allowToShow($typeObj)) {
				return '';
			}
		}
		ob_start();
		echo $typeObj->getViewContent();

		if(!empty($content)) {
			echo "<a href='javascript:void(0)' class='ycd-circle-popup' data-id=".esc_attr($id).">$content</a>";
		}
		$content = ob_get_contents();
		ob_get_clean();

		return $content;
	}

	public function tableColumnValues($column, $postId) {
	    $countdownObj = Countdown::find($postId);
	    
		if ($column == 'shortcode') {
			echo '<input type="text" onfocus="this.select();" readonly value="[ycd_countdown id='.$postId.']" class="large-text code">';
		}
		if ($column == 'type') {
			$title = '';
		    if (!empty($countdownObj)) {
		        $title = $countdownObj->getTypeTitle();
            }
		    echo $title;
			$allowToShowExpiration = $countdownObj->allowToShowExpiration();
			if(is_object($countdownObj) && $countdownObj->getIsCountdown() && $allowToShowExpiration) {
			    if($countdownObj->isExpired()) {
				    echo '<div>Date: Expired</div>';
                }
                else {
                	$dateString = $countdownObj->getExpireDate();
	                
	                echo '<div>Expires after '.$dateString.'</div>';
                }
				
			}
        }
		if ($column == 'onof') {
			$checked = '';
			$isActive = Countdown::isActivePost($postId);

			if ($isActive) {
				$checked = 'checked';
			}
			?>
			<label class="ycd-switch">
				<input type="checkbox" data-id="<?= esc_attr($postId); ?>" name="ycd-countdown-show-mobile" class="ycd-accordion-checkbox ycd-countdown-enable" <?= $checked; ?> >
				<span class="ycd-slider ycd-round"></span>
			</label>
			<?php
		}
	}

	public function generalOptions() {
		if(YCD_PKG_VERSION == YCD_FREE_VERSION) {
			add_meta_box('ycdUpgrade', __('Upgrade', YCD_TEXT_DOMAIN), array($this, 'upgradeToPro'), YCD_COUNTDOWN_POST_TYPE, 'side', 'high');
		}
	}

	public function upgradeToPro() {
		require_once(YCD_VIEWS_PATH.'upgrade.php');
	}

	public function saveSettings() {
	    $post = $_POST;
        $userRoles = $post['ycd-user-roles'];

        if (isset($post['ycd-dont-delete-data'])) {
	        update_option('ycd-delete-data', true);
        }
        else {
            delete_option('ycd-delete-data');
        }

        update_option('ycd-user-roles', $userRoles);
		wp_redirect(admin_url().'edit.php?post_type='.YCD_COUNTDOWN_POST_TYPE.'&page='.YCD_COUNTDOWN_SETTINGS);
    }
}
