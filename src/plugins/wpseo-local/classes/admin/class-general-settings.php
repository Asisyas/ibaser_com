<?php
/**
 * @package WPSEO_Local\Admin\
 * @since   4.0
 */

if ( ! defined( 'WPSEO_LOCAL_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'WPSEO_Local_Admin_General_Settings' ) ) {

	/**
	 * WPSEO_Local_Admin_General_Settings class.
	 *
	 * Build the WPSEO Local admin form.
	 *
	 * @since   4.0
	 */
	class WPSEO_Local_Admin_General_Settings {

		/**
		 * Holds the slug for this settings tab.
		 *
		 * @var string
		 */
		private $slug = 'general';

		/**
		 * Holds WPSEO Local Core instance.
		 *
		 * @var mixed
		 */
		private $wpseo_local_core;

		/**
		 * Holds WPSEO Local Timezone Repository instance.
		 *
		 * @var mixed
		 */
		private $wpseo_local_timezone_repository;

		/**
		 * Stores the options for this plugin.
		 *
		 * @var mixed
		 */
		private $options;

		/**
		 * WPSEO_Local_Admin_General_Settings constructor.
		 */
		public function __construct() {
			$this->get_core();
			$this->get_timezone_repository();
			$this->get_options();

			add_filter( 'wpseo_local_admin_tabs', array( $this, 'create_tab' ) );
			add_filter( 'wpseo_local_admin_help_center_video', array( $this, 'set_video' ) );

			add_action( 'wpseo_local_admin_' . $this->slug . '_content', array( $this, 'multiple_locations' ), 10 );
			add_action( 'wpseo_local_admin_' . $this->slug . '_content', array( $this, 'single_location_settings' ), 10 );
			add_action( 'wpseo_local_admin_' . $this->slug . '_content', array( $this, 'multiple_locations_settings' ), 10 );
			add_action( 'wpseo_local_admin_' . $this->slug . '_content', array( $this, 'business_image' ), 10 );
			add_action( 'wpseo_local_admin_' . $this->slug . '_content', array( $this, 'opening_hours' ), 10 );
			add_action( 'wpseo_local_admin_' . $this->slug . '_content', array( $this, 'store_locator' ), 10 );
			add_action( 'wpseo_local_admin_' . $this->slug . '_content', array( $this, 'advanced' ), 10 );
			add_action( 'wpseo_local_admin_' . $this->slug . '_content', array( $this, 'local_config' ), 10 );

			add_action( 'pre_update_option_wpseo_local', array( $this, 'update_lat_long' ), 10, 2 );
			add_action( 'pre_update_option_wpseo_local', array( $this, 'update_timezone' ), 10, 2 );
		}

		/**
		 * Set WPSEO Local Core instance in local property
		 */
		private function get_core() {
			global $wpseo_local_core;
			$this->wpseo_local_core = $wpseo_local_core;
		}

		/**
		 * Set WPSEO Local Core Timezone Repository in local property
		 */
		private function get_timezone_repository() {
			$wpseo_local_timezone_repository       = new WPSEO_Local_Timezone_Repository();
			$this->wpseo_local_timezone_repository = $wpseo_local_timezone_repository;
		}

		/**
		 * Get wpseo_local options.
		 */
		private function get_options() {
			$this->options = get_option( 'wpseo_local' );
		}

		/**
		 * @param array $tabs Array holding the tabs.
		 *
		 * @return mixed
		 */
		public function create_tab( $tabs ) {
			$tabs[ $this->slug ] = __( 'General settings', 'yoast-local-seo' );

			return $tabs;
		}

		/**
		 * @param array $videos Array holding the videos for the help center.
		 *
		 * @return mixed
		 */
		public function set_video( $videos ) {
			$videos[ $this->slug ] = 'https://yoa.st/screencast-local-settings';

			return $videos;
		}

		/**
		 * Add local config action.
		 */
		public function local_config() {
			do_action( 'wpseo_local_config' );
		}

		/**
		 * Multiple locations checkbox
		 */
		public function multiple_locations() {
			WPSEO_Local_Admin_Page::section_before( 'select-multiple-locations' );
			echo '<p>';
			printf(
				/* translators: %s expands to "Yoast SEO". */
				esc_html__( 'If you have more than one location, you can enable this feature. %s will create a new Custom Post Type for you where you can manage your locations. If it\'s not enabled you can enter your address details below. These fields will be ignored when you enable this option.', 'yoast-local-seo' ),
				'Yoast SEO'
			);
			echo '</p>';
			WPSEO_Local_Admin_Wrappers::checkbox( 'use_multiple_locations', '', __( 'Use multiple locations', 'yoast-local-seo' ) );
			WPSEO_Local_Admin_Page::section_after(); // End select-multiple-locations section.
		}

		/**
		 * Single locations settings section.
		 */
		public function single_location_settings() {
			WPSEO_Local_Admin_Page::section_before( 'single-location-settings', 'clear: both; ' . ( wpseo_has_multiple_locations() ? 'display: none;' : '' ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_name', apply_filters( 'yoast-local-seo-admin-label-business-name', __( 'Business name', 'yoast-local-seo' ) ) );

			WPSEO_Local_Admin_Wrappers::select( 'business_type', apply_filters( 'yoast-local-seo-admin-label-business-type', __( 'Business type', 'yoast-local-seo' ) ), $this->wpseo_local_core->get_local_business_types() );
			echo '<p class="desc label" style="border:none; margin-bottom: 0;">';
			printf(
				/* translators: 1: link open tag; 2: link close tag. */
				esc_html__( 'If your business type is not listed, please read %1$sthe FAQ entry%2$s.', 'yoast-local-seo' ),
				'<a href="http://kb.yoast.com/article/49-my-business-is-not-listed-can-you-add-it" target="_blank">',
				'</a>'
			);
			echo '</p>';

			WPSEO_Local_Admin_Wrappers::textinput( 'location_address', apply_filters( 'yoast-local-seo-admin-label-business-address', __( 'Business address', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_address_2', apply_filters( 'yoast-local-seo-admin-label-business-address-2', __( 'Business address line 2', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_city', apply_filters( 'yoast-local-seo-admin-label-business-city', __( 'Business city', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_state', apply_filters( 'yoast-local-seo-admin-label-business-state', __( 'Business state', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_zipcode', apply_filters( 'yoast-local-seo-admin-label-business-zipcode', __( 'Business zipcode', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::select( 'location_country', apply_filters( 'yoast-local-seo-admin-label-business-country', __( 'Business country', 'yoast-local-seo' ) ), WPSEO_Local_Frontend::get_country_array() );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_phone', apply_filters( 'yoast-local-seo-admin-label-business-phone', __( 'Business phone', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_phone_2nd', apply_filters( 'yoast-local-seo-admin-label-business-phone-2', __( '2nd Business phone', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_fax', apply_filters( 'yoast-local-seo-admin-label-business-fax', __( 'Business fax', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_email', apply_filters( 'yoast-local-seo-admin-label-business-email', __( 'Business email', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_url', apply_filters( 'yoast-local-seo-admin-label-business-url', __( 'URL', 'yoast-local-seo' ) ), '', array( 'placeholder' => WPSEO_Sitemaps_Router::get_base_url( '' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_vat_id', apply_filters( 'yoast-local-seo-admin-label-business-vat-id', __( 'VAT ID', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_tax_id', apply_filters( 'yoast-local-seo-admin-label-business-tax-id', __( 'Tax ID', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_coc_id', apply_filters( 'yoast-local-seo-admin-label-business-coc-id', __( 'Chamber of Commerce ID', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_price_range', apply_filters( 'yoast-local-seo-admin-label-business-price-range', __( 'Price range', 'yoast-local-seo' ) ) );

			echo '<p>' . esc_html__( 'You can enter the lat/long coordinates yourself. If you leave them empty they will be calculated automatically. If you want to re-calculate these fields, please make them blank before saving this location.', 'yoast-local-seo' ) . '</p>';
			if ( empty( $this->options['location_coords_lat'] ) || empty( $this->options['location_coords_long'] ) ) {
				echo '<p>' . esc_html__( 'In order for automatic lat/long calculation to work, you first need to enter an API code under the API tab at the top of this page', 'yoast-local-seo' ) . '</p>';
			}
			WPSEO_Local_Admin_Wrappers::textinput( 'location_coords_lat', apply_filters( 'yoast-local-seo-admin-label-business-lat', __( 'Latitude', 'yoast-local-seo' ) ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'location_coords_long', apply_filters( 'yoast-local-seo-admin-label-business-long', __( 'Longitude', 'yoast-local-seo' ) ) );
			// Only show the map when lat/long coords are there.
			if ( '' != $this->options['location_coords_lat'] && '' != $this->options['location_coords_long'] ) {
				echo '<p>' . esc_html__( 'If the marker is not in the right location for your store, you can drag the pin to the location where you want it.', 'yoast-local-seo' ) . '</p>';

				$args = array(
					'echo'       => true,
					'show_route' => false,
					'map_style'  => 'roadmap',
					'draggable'  => true,
				);
				wpseo_local_show_map( $args );
			}
			WPSEO_Local_Admin_Page::section_after(); // End show-single-locaton section.
		}

		/**
		 * Multiple locations settings section.
		 */
		public function multiple_locations_settings() {
			$base_url = get_site_url();

			WPSEO_Local_Admin_Page::section_before( 'multiple-locations-settings', 'clear: both; ' . ( wpseo_has_multiple_locations() ? '' : 'display: none;' ) );

			echo '<h2>' . esc_html__( 'Permalinks', 'yoast-local-seo' ) . '</h2>';
			echo '<p>';
			printf(
				/* translators: %1$s and %2$s show code blocks with a URL inside */
				esc_html__( 'Each location and location category will receive a custom URL. By default, these are %1$s and %2$s. If you like, you may enter custom structures for your locations and location categories.', 'yoast-local-seo' ),
				'<code>/locations/%postname%/</code>', // Post URL.
				'<code>/locations-category/%category-slug%/</code>' // Category URL.
			);
			echo '</p>';

			echo '<div class="wpseo_local_input">';
			echo '<code class="before">' . esc_url( $base_url ) . '/</code>';
			WPSEO_Local_Admin_Wrappers::textinput( 'locations_slug', apply_filters( 'yoast-local-seo-admin-label-locations-slug', __( 'Locations base', 'yoast-local-seo' ) ) );
			echo '<code class="after">/%postname%/</code>';
			echo '</div>';
			echo '<p class="desc label" style="border: 0; margin-bottom: 0; padding-bottom: 0;">';
			printf(
				/* translators: 1: HTML <code> open tag; 2: <code> close tag. */
				esc_html__( 'The slug for your location pages. Default slug is %1$slocation%2$s.', 'yoast-local-seo' ),
				'<code>',
				'</code>'
			);
			echo '</p>';

			echo '<div class="wpseo_local_input">';
			echo '<code class="before">' . esc_url( $base_url ) . '/</code>';
			WPSEO_Local_Admin_Wrappers::textinput( 'locations_taxo_slug', apply_filters( 'yoast-local-seo-admin-label-locations-category-slug', __( 'Locations category base', 'yoast-local-seo' ) ) );
			echo '<code class="after">/%category-slug%/</code>';
			echo '</div>';
			echo '<p class="desc label" style="border: 0; margin-bottom: 0; padding-bottom: 0;">';
			printf(
				/* translators: 1: HTML <code> open tag; 2: <code> close tag. */
				esc_html__( 'The category slug for your location pages. Default slug is %1$slocations%2$s.', 'yoast-local-seo' ),
				'<code>',
				'</code>'
			);
			echo '</p>';

			echo '<h2>' . esc_html__( 'Admin Label', 'yoast-local-seo' ) . '</h2>';
			echo '<p>' . esc_html__( 'With multiple locations, you will have a new menu item in your admin sidebar. By default, this menu item is labeled using the plural term of Locations with each single item being called a Location. If you like, you may enter custom labels to better match your business.', 'yoast-local-seo' ) . '</p>';

			WPSEO_Local_Admin_Wrappers::textinput( 'locations_label_singular', apply_filters( 'yoast-local-seo-admin-label-locations-label', __( 'Single label', 'yoast-local-seo' ) ) );
			echo '<p class="desc label" style="border: 0; margin-bottom: 0; padding-bottom: 0;">';
			printf(
				/* translators: 1: HTML <code> open tag; 2: <code> close tag. */
				esc_html__( 'The singular label for your location pages. Default label is %1$sLocation%2$s.', 'yoast-local-seo' ),
				'<code>',
				'</code>'
			);
			echo '</p>';

			WPSEO_Local_Admin_Wrappers::textinput( 'locations_label_plural', apply_filters( 'yoast-local-seo-admin-label-locations-label-plural', __( 'Plural label', 'yoast-local-seo' ) ) );
			echo '<p class="desc label" style="border: 0; margin-bottom: 0; padding-bottom: 0;">';
			printf(
				/* translators: 1: HTML <code> open tag; 2: <code> close tag. */
				esc_html__( 'The plural label for your location pages. Default label is %1$sLocations%2$s.', 'yoast-local-seo' ),
				'<code>',
				'</code>'
			);
			echo '</p>';
			WPSEO_Local_Admin_Page::section_after();
		}

		/**
		 * Business image section.
		 */
		public function business_image() {
			WPSEO_Local_Admin_Page::section_before( 'wpseo-local-business_image', null, 'wpseo-local-business_image-wrapper' );
			echo '<h2>' . esc_html__( 'Business image', 'yoast-local-seo' ) . '</h2>';
			echo '<label class="textinput" for="business_image">' . esc_html__( 'Business image', 'yoast-local-seo' ) . ':</label>';
			WPSEO_Local_Admin_Wrappers::hidden( 'business_image' );

			$business_image = ! empty( $this->options['business_image'] );
			echo '<img src="' . ( isset( $this->options['business_image'] ) ? esc_url( wp_get_attachment_image_url( $this->options['business_image'], 'medium' ) ) : '' ) . '" id="business_image_image_container" class="wpseo-local-hide-button' . ( ( false === $business_image ) ? ' hidden' : '' ) . '">';
			echo '<br class="wpseo-local-hide-button' . ( ( false === $business_image ) ? ' hidden' : '' ) . '">';
			echo '<p class="desc label" style="border: none;">';
			echo '<a href="javascript:" class="set_custom_images button" data-id="business_image">' . esc_html__( 'Set image', 'yoast-local-seo' ) . '</a>';
			echo ' <a href="javascript:" class="remove_custom_image wpseo-local-hide-button' . ( ( false === $business_image ) ? ' hidden' : '' ) . '" style="color: #a00 !important;" data-id="business_image">' . esc_html__( 'Remove image', 'yoast-local-seo' ) . '</a>';
			echo '<br>';
			echo __( 'This image is used in the Local Knowledge Panel on Google\'s Search Engine Result Page', 'yoast-local-seo' );
			echo '</p>';
			WPSEO_Local_Admin_Page::section_after();
		}

		/**
		 * Opening hours settings section.
		 */
		public function opening_hours() {
			WPSEO_Local_Admin_Page::section_before( 'opening-hours-container', 'clear: both; ' );
			echo '<h2>' . esc_html__( 'Opening hours', 'yoast-local-seo' ) . '</h2>';
			WPSEO_Local_Admin_Wrappers::checkbox( 'hide_opening_hours', '', __( 'Hide opening hours option', 'yoast-local-seo' ) );

			$hide_opening_hours = isset( $this->options['hide_opening_hours'] ) && $this->options['hide_opening_hours'] === 'on';
			$open_247           = isset( $this->options['open_247'] ) && $this->options['open_247'] === 'on';

			WPSEO_Local_Admin_Page::section_before( 'opening-hours-settings', 'clear: both; display:' . ( ( true === $hide_opening_hours ) ? 'none' : 'block' ) . ';' );
			WPSEO_Local_Admin_Wrappers::textinput( 'closed_label', __( 'Closed label', 'yoast-local-seo' ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'open_24h_label', __( 'Open 24h label', 'yoast-local-seo' ) );
			WPSEO_Local_Admin_Wrappers::textinput( 'open_247_label', __( 'Open 24/7 label', 'yoast-local-seo' ) );
			WPSEO_Local_Admin_Wrappers::checkbox( 'opening_hours_24h', '', __( 'Use 24h format', 'yoast-local-seo' ) );
			WPSEO_Local_Admin_Page::section_after(); // End opening-hours-inner section.
			WPSEO_Local_Admin_Page::section_before( 'opening-hours-hours', 'clear: both; display:' . ( ( true === $hide_opening_hours || wpseo_has_multiple_locations() ) ? 'none' : 'block' ) . ';' );
			echo '<div class="open_247_wrapper">';
			WPSEO_Local_Admin_Wrappers::checkbox( 'open_247', '', __( 'Open 24/7', 'yoast-local-seo' ) );
			echo '</div>';
			WPSEO_Local_Admin_Page::section_before( 'opening-hours-rows', 'clear: both; display:' . ( ( true === $open_247 ) ? 'none' : 'block' ) . ';', 'opening-hours-rows' );
			WPSEO_Local_Admin_Wrappers::checkbox( 'multiple_opening_hours', '', __( 'I have two sets of opening hours per day', 'yoast-local-seo' ) );
			echo '<p>';
			printf(
				/* translators: 1: <strong> open tag; 2: <strong> close tag. */
				esc_html__( 'If a specific day only has one set of opening hours, please set the second set for that day to %1$sclosed%2$s', 'yoast-local-seo' ),
				'<strong>',
				'</strong>'
			);
			echo '</p>';
			foreach ( $this->wpseo_local_core->days as $key => $day ) {
				$field_name        = 'opening_hours_' . $key;
				$value_from        = isset( $this->options[ $field_name . '_from' ] ) ? esc_attr( $this->options[ $field_name . '_from' ] ) : '09:00';
				$value_to          = isset( $this->options[ $field_name . '_to' ] ) ? esc_attr( $this->options[ $field_name . '_to' ] ) : '17:00';
				$value_second_from = isset( $this->options[ $field_name . '_second_from' ] ) ? esc_attr( $this->options[ $field_name . '_second_from' ] ) : '09:00';
				$value_second_to   = isset( $this->options[ $field_name . '_second_to' ] ) ? esc_attr( $this->options[ $field_name . '_second_to' ] ) : '17:00';

				$value_24h = isset( $this->options[ $field_name . '_24h' ] ) ? esc_attr( $this->options[ $field_name . '_24h' ] ) : false;

				$use_24_hours = isset( $this->options['opening_hours_24h'] ) ? $this->options['opening_hours_24h'] : false;
				WPSEO_Local_Admin_Page::section_before( 'opening-hours-' . $key, null, 'opening-hours' );
				echo '<label class="textinput">' . $day . ':</label>';
				echo '<div class="openinghours-wrapper">';
				echo '<select class="openinghours_from" style="width: 100px;" id="' . $field_name . '_from" name="wpseo_local[' . $field_name . '_from]" ' /*disabled: */ . ( ( 'on' === $value_24h ) ? ' disabled="disabled" ' : '' ) . '>';
				echo wpseo_show_hour_options( $use_24_hours, $value_from );
				echo '</select>';
				echo '<span> - </span>';
				echo '<select class="openinghours_to" style="width: 100px;" id="' . $field_name . '_to" name="wpseo_local[' . $field_name . '_to]" ' /*disabled: */ . ( ( 'on' === $value_24h ) ? 'disabled="disabled"' : '' ) . '>';
				echo wpseo_show_hour_options( $use_24_hours, $value_to );
				echo '</select>';

				WPSEO_Local_Admin_Page::section_before( 'opening-hours-second-' . $key, null, 'opening-hours-second ' . ( ( empty( $this->options['multiple_opening_hours'] ) || $this->options['multiple_opening_hours'] !== 'on' ) ? 'hidden' : '' ) . '' );
				echo '<select class="openinghours_from_second" style="width: 100px;" id="' . $field_name . '_second_from" name="wpseo_local[' . $field_name . '_second_from]" ' /*disabled: */ . ( ( 'on' === $value_24h ) ? 'disabled="disabled"' : '' ) . '>';
				echo wpseo_show_hour_options( $use_24_hours, $value_second_from );
				echo '</select>';
				echo '<span> - </span>';
				echo '<select class="openinghours_to_second" style="width: 100px;" id="' . $field_name . '_second_to" name="wpseo_local[' . $field_name . '_second_to]" ' /*disabled: */ . ( ( 'on' === $value_24h ) ? 'disabled="disabled"' : '' ) . '>';
				echo wpseo_show_hour_options( $use_24_hours, $value_second_to );
				echo '</select>';
				WPSEO_Local_Admin_Page::section_after(); // End opening-hours-second-{key} section.
				echo '</div>';
				echo '<label class="wpseo_open_24h" for="' . $field_name . '_24h"><input type="checkbox" name="wpseo_local[' . $field_name . '_24h]" id="' . $field_name . '_24h" ' . checked( $value_24h, 'on', false ) . ' /> ' . __( 'Open 24h', 'yoast-local-seo' ) . '</label>';

				WPSEO_Local_Admin_Page::section_after(); // End opening-hours-{$key} section.
			}
			WPSEO_Local_Admin_Page::section_after();

			WPSEO_Local_Admin_Page::section_after(); // End opening-hours-hours section.

			WPSEO_Local_Admin_Page::section_after(); // End opening-hours-container section.
		}

		/**
		 * Store locator settings section.
		 */
		public function store_locator() {
			WPSEO_Local_Admin_Page::section_before( 'sl-settings', 'clear: both; ' . ( wpseo_has_multiple_locations() ? '' : 'display: none;' ) );
			echo '<h2>' . esc_html__( 'Store locator settings', 'yoast-local-seo' ) . '</h2>';
			WPSEO_Local_Admin_Wrappers::textinput( 'sl_num_results', __( 'Number of results', 'yoast-local-seo' ) );
			WPSEO_Local_Admin_Page::section_after();
		}

		/**
		 * Advanced settings section.
		 */
		public function advanced() {
			WPSEO_Local_Admin_Page::section_before( 'wpseo-local-advanced' );
			echo '<h2>' . esc_html__( 'Advanced settings', 'yoast-local-seo' ) . '</h2>';

			$select_options = array(
				'METRIC'   => __( 'Metric', 'yoast-local-seo' ),
				'IMPERIAL' => __( 'Imperial', 'yoast-local-seo' ),
			);
			WPSEO_Local_Admin_Wrappers::select(
				'unit_system',
				__( 'Unit System', 'yoast-local-seo' ),
				$select_options
			);

			if ( true === is_ssl() ) {
				WPSEO_Local_Admin_Wrappers::checkbox( 'detect_location', '', __( 'Location detection', 'yoast-local-seo' ) );
				echo '<p class="desc label">' . __( 'Automatically detect the users location as starting point.', 'yoast-local-seo' ) . '</p>';
			}
			else {
				echo '<label class="checkbox" for="detect_location">Location detection: (disabled)</label>';
				echo '<p class="desc label" style="border:none; margin-bottom: 0;"><em>';
				printf(
					/* translators: 1: link open tag; 2: link close tag. */
					esc_html__( 'This option only works on HTTPS websites. Using HTTPS is important, read more about it in the %1$sYoast KB%2$s', 'yoast-local-seo' ),
					'<a href="https://yoa.st/local-seo-https">',
					'</a>'
				);
				echo '</em></p>';
			}

			$select_options = array(
				'HYBRID'    => __( 'Hybrid', 'yoast-local-seo' ),
				'SATELLITE' => __( 'Satellite', 'yoast-local-seo' ),
				'ROADMAP'   => __( 'Roadmap', 'yoast-local-seo' ),
				'TERRAIN'   => __( 'Terrain', 'yoast-local-seo' ),
			);
			WPSEO_Local_Admin_Wrappers::select(
				'map_view_style',
				__( 'Default map style', 'yoast-local-seo' ),
				$select_options
			);

			$select_options = array(
				'address-state-postal'       => '{address} {city}, {state} {zipcode} &nbsp;&nbsp;&nbsp;&nbsp; (New York, NY 12345 )',
				'address-state-postal-comma' => '{address} {city}, {state}, {zipcode} &nbsp;&nbsp;&nbsp;&nbsp; (New York, NY, 12345 )',
				'address-postal-city-state'  => '{address} {zipcode} {city}, {state} &nbsp;&nbsp;&nbsp;&nbsp; (12345 New York, NY )',
				'address-postal'             => '{address} {city} {zipcode} &nbsp;&nbsp;&nbsp;&nbsp; (New York 12345 )',
				'address-postal-comma'       => '{address} {city}, {zipcode} &nbsp;&nbsp;&nbsp;&nbsp; (New York, 12345 )',
				'address-city'               => '{address} {city} &nbsp;&nbsp;&nbsp;&nbsp; (New York)',
				'postal-address'             => '{zipcode} {state} {city} {address} &nbsp;&nbsp;&nbsp;&nbsp; (12345 NY New York)',
			);
			WPSEO_Local_Admin_Wrappers::select(
				'address_format',
				__( 'Address format', 'yoast-local-seo' ),
				$select_options
			);

			/* translators: %s extends to <a href="mailto:pluginsupport@yoast.com">pluginsupport@yoast.com</a> */
			echo '<p class="desc label" style="border:none;">' . sprintf( __( 'A lot of countries have their own address format. Please choose one that matches yours. If you have something completely different, please let us know via %s.', 'yoast-local-seo' ), '<a href="mailto:pluginsupport@yoast.com">pluginsupport@yoast.com</a>' ) . '</p>';

			// Chosen allows us to clear a set option (to pass no value), but to do that it requires an empty option.
			$countries = ( array( '' => '' ) + WPSEO_Local_Frontend::get_country_array() );

			WPSEO_Local_Admin_Wrappers::select( 'default_country', __( 'Default country', 'yoast-local-seo' ), $countries );

			echo '<p class="desc label" style="border:none;">' . esc_html__( 'If you\'re having multiple locations and they\'re all in one country, you can select your default country here. This country will be used in the storelocator search to improve the search results.', 'yoast-local-seo' ) . '</p>';
			WPSEO_Local_Admin_Wrappers::textinput( 'show_route_label', __( '"Show route" label', 'yoast-local-seo' ), '', array( 'placeholder' => __( 'Show route', 'yoast-local-seo' ) ) );

			WPSEO_Local_Admin_Page::section_before( 'wpseo-local-custom-marker', null, 'wpseo-local-custom_marker-wrapper' );
			echo '<label class="textinput" for="custom_marker">' . esc_html__( 'Custom marker', 'yoast-local-seo' ) . ':</label>';
			WPSEO_Local_Admin_Wrappers::hidden( 'custom_marker' );

			$show_marker = ! empty( $this->options['custom_marker'] );
			echo '<img src="' . ( isset( $this->options['custom_marker'] ) ? wp_get_attachment_url( $this->options['custom_marker'] ) : '' ) . '" id="custom_marker_image_container" class="wpseo-local-hide-button' . ( ( false === $show_marker ) ? ' hidden' : '' ) . '">';
			echo '<br class="wpseo-local-hide-button' . ( ( false === $show_marker ) ? ' hidden' : '' ) . '">';
			echo '<p class="desc label" style="border: none;">';
			echo '<a href="javascript:" class="set_custom_images button" data-id="custom_marker">' . esc_html__( 'Set custom marker image', 'yoast-local-seo' ) . '</a>';
			echo ' <a href="javascript:" class="remove_custom_image wpseo-local-hide-button' . ( ( false === $show_marker ) ? ' hidden' : '' ) . '" style="color: #a00 !important;" data-id="custom_marker">' . esc_html__( 'Remove marker', 'yoast-local-seo' ) . '</a>';
			echo '</p>';
			if ( true == $show_marker ) {
				$this->wpseo_local_core->check_custom_marker_size( $this->options['custom_marker'] );
			}
			else {
				echo '<p class="desc label" style="border:none;">' . esc_html__( 'The custom marker should be 100x100 px. If the image exceeds those dimensions it could (partially) cover the info popup.', 'yoast-local-seo' ) . '</p>';
			}
			WPSEO_Local_Admin_Wrappers::checkbox( 'enhanced_search', '', __( 'Enhanced search', 'yoast-local-seo' ) );
			/* translators: %s expands to "Yoast SEO: Local". */
			echo '<p class="desc label" style="border:none;">' . sprintf( esc_html__( 'Enabling enhanced search will add fields used by %s to the search.', 'yoast-local-seo' ), 'Yoast Local SEO' ) . '</p>';
			WPSEO_Local_Admin_Page::section_after(); // End wpseo-local-custom-marker section.
			WPSEO_Local_Admin_Page::section_after(); // End wpseo-local-advanced section.
		}

		/**
		 * @param array $new_value New value for wpseo_local options.
		 * @param array $old_value Old value for wpseo_local options.
		 *
		 * @return mixed
		 */
		public function update_lat_long( $new_value, $old_value ) {
			// Don't geocode when no address details are known.
			if ( ( empty( $new_value['location_coords_lat'] ) || empty( $new_value['location_coords_lat'] ) ) && empty( $new_value['location_address'] ) ) {
				return $new_value;
			}

			// Calculate lat/long coordinates when address is entered.
			if ( empty( $old_value['location_coords_lat'] ) || empty( $old_value['location_coords_long'] ) ) {
				$location_info        = array(
					'_wpseo_business_address' => isset( $new_value['location_address'] ) ? esc_attr( $new_value['location_address'] ) : '',
					'_wpseo_business_city'    => isset( $new_value['location_city'] ) ? esc_attr( $new_value['location_city'] ) : '',
					'_wpseo_business_state'   => isset( $new_value['location_state'] ) ? esc_attr( $new_value['location_state'] ) : '',
					'_wpseo_business_zipcode' => isset( $new_value['location_zipcode'] ) ? esc_attr( $new_value['location_zipcode'] ) : '',
					'_wpseo_business_country' => isset( $new_value['location_country'] ) ? esc_attr( $new_value['location_country'] ) : '',
				);
				$location_coordinates = $this->wpseo_local_core->get_geo_data( $location_info, true );

				if ( ! empty( $location_coordinates['coords'] ) ) {
					$new_value['location_coords_lat']  = str_replace( ',', '.', $location_coordinates['coords']['lat'] );
					$new_value['location_coords_long'] = str_replace( ',', '.', $location_coordinates['coords']['long'] );
				}
			}

			return $new_value;
		}

		/**
		 * @param array $new_value New value for wpseo_local options.
		 * @param array $old_value Old value for wpseo_local options.
		 *
		 * @return mixed
		 */
		public function update_timezone( $new_value, $old_value ) {
			// Multiple locations are set, there is no need for this update.
			if ( wpseo_has_multiple_locations() ) {
				return $new_value;
			}

			if ( empty( $old_value['location_coords_lat'] ) || empty( $old_value['location_coords_long'] ) ) {
				$timezone = $this->wpseo_local_timezone_repository->get_coords_timezone();

				if ( ! empty( $timezone ) ) {
					$new_value['location_timezone'] = $timezone;
				}
			}

			return $new_value;
		}
	}
}
