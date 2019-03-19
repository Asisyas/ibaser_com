<?php
/**
 * Yoast SEO: Local for WooCommerce plugin file.
 *
 * @package YoastSEO_Local_WooCommerce
 */

/**
 * Class: Yoast_WCSEO_Local_Core.
 */
class Yoast_WCSEO_Local_Core extends WPSEO_Local_Core {

	public function __construct() {
		add_action( 'update_option_wpseo_local', array( $this, 'maybe_flush_shipping_transients' ), 9, 2 );

		parent::__construct();
	}

	/**
	 * Flushes the shipping transients if multiple locations is turned on or off or the slug is changed.
	 */
	public function maybe_flush_shipping_transients( $old_option_value, $new_option_value ) {
		$old_value_exists = array_key_exists( 'use_multiple_locations', $old_option_value );
		$new_value_exists = array_key_exists( 'use_multiple_locations', $new_option_value );

		if ( $old_value_exists !== $new_value_exists ) {
			global $wpdb;
			$wpdb->query( 'DELETE FROM ' . $wpdb->prefix . "options WHERE option_name LIKE '_transient_wc_ship%'" );
		}
	}
}
