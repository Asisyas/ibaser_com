<?php
/**
 * Yoast SEO: Local for WooCommerce plugin file.
 *
 * @package YoastSEO_Local_WooCommerce
 */

/**
 * Class: Yoast_WCSEO_Local_Post_Types.
 */
class Yoast_WCSEO_Local_Post_Types {

	public function init() {

		// Actions.
		add_action( 'init', array( $this, 'register_post_status' ), 9 );

		// Filters.
		add_filter( 'wc_order_statuses', array( $this, 'wc_append_post_statusus' ) );
	}

	public function register_post_status() {
		register_post_status( 'wc-transporting', array(
			'label'                     => _x( 'Transporting', 'Order status', 'yoast-local-seo' ),
			'public'                    => false,
			'exclude_from_search'       => false,
			'show_in_admin_all_list'    => true,
			'show_in_admin_status_list' => true,
			/* translators: %d translates to the number or orders in transport. */
			'label_count'               => _n_noop( 'Transporting <span class="count">(%d)</span>', 'Transporting <span class="count">(%d)</span>', 'yoast-local-seo' ),
		) );

		register_post_status( 'wc-ready-for-pickup', array(
			'label'                     => _x( 'Ready for pickup', 'Order status', 'yoast-local-seo' ),
			'public'                    => false,
			'exclude_from_search'       => false,
			'show_in_admin_all_list'    => true,
			'show_in_admin_status_list' => true,
			/* translators: %d translates to the number or orders ready for pickup. */
			'label_count'               => _n_noop( 'Ready for pickup <span class="count">(%d)</span>', 'Ready for pickup <span class="count">(%d)</span>', 'yoast-local-seo' ),
		) );
	}

	public function wc_append_post_statusus( $order_statuses ) {

		$new_order_statuses = array();

		// Add new order status after processing.
		foreach ( $order_statuses as $key => $status ) {

			$new_order_statuses[ $key ] = $status;

			if ( 'wc-processing' === $key ) {
				$new_order_statuses['wc-transporting']     = _x( 'Transporting', 'Order status', 'yoast-local-seo' );
				$new_order_statuses['wc-ready-for-pickup'] = _x( 'Ready for pickup', 'Order status', 'yoast-local-seo' );
			}
		}

		return $new_order_statuses;
	}
}
