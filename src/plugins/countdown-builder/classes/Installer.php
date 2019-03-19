<?php
namespace ycd;
use \YcdShowReviewNotice;

class Installer {

	public static function uninstall() {

		if (!get_option('ycd-delete-data')) {
			return false;
		}

		YcdShowReviewNotice::deleteInitialDates();
		self::deleteCountdowns();
	}

	/**
	 * Delete all popup builder post types posts
	 *
	 * @since 1.2.2
	 *
	 * @return void
	 *
	 */
	private static function deleteCountdowns()
	{
		$countdowns = get_posts(
			array(
				'post_type' => YCD_COUNTDOWN_POST_TYPE,
				'post_status' => array(
					'publish',
					'pending',
					'draft',
					'auto-draft',
					'future',
					'private',
					'inherit',
					'trash'
				)
			)
		);

		foreach ($countdowns as $countdown) {
			if (empty($countdown)) {
				continue;
			}
			wp_delete_post($countdown->ID, true);
		}
	}

	public static function install() {
		self::createTables();
		YcdShowReviewNotice::setInitialDates();

		if(is_multisite() && get_current_blog_id() == 1) {
			global $wp_version;

			if($wp_version > '4.6.0') {
				$sites = get_sites();
			}
			else {
				$sites = wp_get_sites();
			}

			foreach($sites as $site) {

				if($wp_version > '4.6.0') {
					$blogId = $site->blog_id."_";
				}
				else {
					$blogId = $site['blog_id']."_";
				}
				if($blogId != 1) {
					self::createTables($blogId);
				}
			}
		}
	}

	public static function createTables($blogId = '') {
		global $wpdb;
		$createTableHeader = 'CREATE TABLE IF NOT EXISTS '.$wpdb->prefix.$blogId;

		$subscriberTableQuery = $createTableHeader.YCD_COUNTDOWN_SUBSCRIBERS_TABLE.' (
			`id` int(11) NOT NULL AUTO_INCREMENT,
			`email` varchar(255) NOT NULL,
			`cDate` date,
			`type` int(12),
			`status` varchar(255) NOT NULL,
			PRIMARY KEY (id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8; ';

		$wpdb->query($subscriberTableQuery);
	}
}