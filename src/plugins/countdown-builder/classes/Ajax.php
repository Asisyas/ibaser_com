<?php
namespace ycd;
use \YcdCountdownConfig;
use \DateTime;

class Ajax {

	public function __construct() {
		$this->init();
	}

	public function init() {
		add_action('wp_ajax_ycd-switch', array($this, 'switchCountdown'));
		add_action('wp_ajax_ycdSupport', array($this, 'ycdSupport'));

		// review panel
		add_action('wp_ajax_ycd_dont_show_review_notice', array($this, 'dontShowReview'));
		add_action('wp_ajax_ycd_change_review_show_period', array($this, 'changeReviewPeriod'));
	}

	public function changeReviewPeriod() {
		check_ajax_referer('ycdReviewNotice', 'ajaxNonce');
		$messageType = sanitize_text_field($_POST['messageType']);

		$timeDate = new DateTime('now');
		$timeDate->modify('+'.YCD_SHOW_REVIEW_PERIOD.' day');

		$timeNow = strtotime($timeDate->format('Y-m-d H:i:s'));
		update_option('YcdShowNextTime', $timeNow);
		$usageDays = get_option('YcdUsageDays');
		$usageDays += YCD_SHOW_REVIEW_PERIOD;
		update_option('YcdUsageDays', $usageDays);

		echo YCD_AJAX_SUCCESS;
		wp_die();
	}

	public function dontShowReview() {
		check_ajax_referer('ycdReviewNotice', 'ajaxNonce');
		update_option('YcdDontShowReviewNotice', 1);

		echo YCD_AJAX_SUCCESS;
		wp_die();
	}

	public function ycdSupport() {
		check_ajax_referer('ycd_ajax_nonce', 'nonce');
		parse_str($_POST['formData'], $params);

		$headers  = 'MIME-Versions: 1.0'."\r\n";
		//$headers .= 'From: '.$sendFromEmail.''."\r\n";
		$headers .= 'Content-types: text/plain; charset=UTF-8'."\r\n";
		$message = '<b>Report type</b>: '.$params['report_type'].'<br>';
		$message .= '<b>Name</b>: '.$params['name'].'<br>';
		$message .= '<b>Email</b>: '.$params['email'].'<br>';
		$message .= '<b>Website</b>: '.$params['website'].'<br>';
		$message .= '<b>Message</b>: '.$params['ycd-message'].'<br>';
		$message .= '<b>version</b>: '.YcdCountdownConfig::getVersionString().'<br>';

		$sendStatus = wp_mail('adamskaat1@gmail.com', 'Web site support', $message, $headers);

		echo $sendStatus;
		die();
	}

	public function switchCountdown() {
		check_ajax_referer('ycd_ajax_nonce', 'nonce');
		$postId = (int)$_POST['id'];
		$checked = $_POST['checked'] == 'true' ? '' : true;
		update_post_meta($postId, 'ycd_enable', $checked);
		wp_die();
	}
}

new Ajax();