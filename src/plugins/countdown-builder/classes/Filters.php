<?php
namespace ycd;

class Filters {

    public function __construct() {
        $this->init();
    }

    public function init() {
        add_filter('admin_url', array($this, 'addNewPostUrl'), 10, 2);
        add_filter('manage_'.YCD_COUNTDOWN_POST_TYPE.'_posts_columns' , array($this, 'tableColumns'));
	    add_filter('ycdDefaults', array($this, 'defaults'), 10, 1);
	    add_filter('post_updated_messages' , array($this, 'updatedMessages'), 10, 1);
	    add_filter('cron_schedules', array($this, 'cronAddMinutes'), 10, 1);
    }
	
	public function cronAddMinutes($schedules)
	{
		$schedules['ycd_newsletter_send_every_minute'] = array(
			'interval' => YCD_CRON_REPEAT_INTERVAL * 60,
			'display' => __('Once Every Minute', YCD_TEXT_DOMAIN)
		);
		
		return $schedules;
	}
	
	public function defaults($defaults) {
		if(YCD_PKG_VERSION != YCD_FREE_VERSION) {
			return $defaults;
		}
		$defaults['countdownExpireTime']['fields'][2]['label']['name'] .= '<span class="ycd-pro-span">PRO</span>';
		$defaults['countdownExpireTime']['fields'][2]['attr']['class'] .= ' ycd-option-wrapper-pro';
		$defaults['countdownExpireTime']['fields'][3]['label']['name'] .= '<span class="ycd-pro-span">PRO</span>';
		$defaults['countdownExpireTime']['fields'][3]['attr']['class'] .= ' ycd-option-wrapper-pro';
		
		@$defaults['countdown-date-type']['fields'][2]['label']['name'] .= '<span class="ycd-pro-span">PRO</span>';
		@$defaults['countdown-date-type']['fields'][2]['attr']['class'] .= ' ycd-option-wrapper-pro';
		
		return $defaults;
	}
    
    public function updatedMessages($messages) {
    	$currentPostType = AdminHelper::getCurrentPostType();
        if ($currentPostType != YCD_COUNTDOWN_POST_TYPE) {
        	return $messages;
        }
	    $messages[YCD_COUNTDOWN_POST_TYPE][1] = 'Countdown updated.';
	    $messages[YCD_COUNTDOWN_POST_TYPE][6] = 'Countdown published.';
	    $messages[YCD_COUNTDOWN_POST_TYPE][7] = 'Countdown saved.';
     
	    return $messages;
	}

    public function addNewPostUrl($url, $path) {
        if ($path == 'post-new.php?post_type='.YCD_COUNTDOWN_POST_TYPE) {
            $url = str_replace('post-new.php?post_type='.YCD_COUNTDOWN_POST_TYPE, 'edit.php?post_type='.YCD_COUNTDOWN_POST_TYPE.'&page='.YCD_COUNTDOWN_POST_TYPE, $url);
        }

        return $url;
    }

    public function tableColumns($columns) {
        unset($columns['date']);

        $additionalItems = array();
	    $additionalItems['onof'] = __('Enabled (show countdown)', YCD_TEXT_DOMAIN);
        $additionalItems['type'] = __('Type', YCD_TEXT_DOMAIN);
        $additionalItems['shortcode'] = __('Shortcode', YCD_TEXT_DOMAIN);

        return $columns + $additionalItems;
    }
}