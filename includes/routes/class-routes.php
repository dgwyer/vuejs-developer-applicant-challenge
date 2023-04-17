<?php
/**
 * Plugin routes.
 *
 * @package VueJSDeveloperChallenge
 */

namespace VueJSDeveloperChallenge\Routes;

/**
 * Constants class.
 */
class Routes {

	/**
	 * Main class constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register plugin routes.
	 */
	public function register_routes() {
		// Route to get data from an external API.
		register_rest_route(
			'vuejs-challenge/v1',
			'/get-api-data',
			array(
				'methods'              => 'GET',
				'callback'             => array( $this, 'get_api_data' ),
				'permissions_callback' => 'check_permissions',
			)
		);

		// Route to get all plugin settings.
		register_rest_route(
			'vuejs-challenge/v1',
			'/get-plugin-settings',
			array(
				'methods'              => 'GET',
				'callback'             => array( $this, 'get_plugin_settings' ),
				'permissions_callback' => 'check_permissions',
			)
		);

		// Route to set an individual setting.
		register_rest_route(
			'vuejs-challenge/v1',
			'/update-setting/(?P<setting>\w+)',
			array(
				'methods'              => 'POST',
				'callback'             => array( $this, 'update_setting' ),
				'permissions_callback' => 'check_permissions',
				'args'                 => array(
					'setting' => array(
						'sanitize_callback' => function( $param ) {
							if ( 'numrows' === $param || 'humandate' === $param || 'emails' === $param ) {
								return $param;
							} else {
								return new \WP_Error( 'rest_invalid_param', 'Invalid endpoint parameter: ' . $param );
							}
						},
					),
				),
			)
		);
	}

	/**
	 * Get data from an external API no more than once per hour.
	 *
	 * @return array
	 */
	public function get_api_data() {
		$cache_key   = 'get_api_data';
		$cached_data = get_transient( $cache_key );

		if ( false === $cached_data ) {
			// If data is not cached, retrieve the data from external API.
			$response = wp_remote_get( 'https://miusage.com/v1/challenge/2/static/' );

			// Check if the API call was successful.
			if ( ! is_wp_error( $response ) && wp_remote_retrieve_response_code( $response ) === 200 ) {
				// Get the API response body.
				$api_response = wp_remote_retrieve_body( $response );

				// Store the API response in cache for 1 hour (3600 seconds).
				set_transient( $cache_key, $api_response, 3600 );

				// Return the API response.
				return $api_response;
			} else {
				// Return an error message.
				return 'Failed to get data from external API.';
			}
		} else {
			// If data is already cached, return the cached data.
			return $cached_data;
		}
	}

	/**
	 * Get plugin settings.
	 *
	 * @return array
	 */
	public function get_plugin_settings() {

		$value = get_option( 'test_project_option', null );
		return new \WP_REST_Response(
			array(
				'success' => true,
				'data'    => $value,
			)
		);
	}

	/**
	 * Set plugin setting.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return array
	 */
	public function update_setting( $request ) {
		$setting = $request->get_param( 'setting' );
		$value   = $request->get_param( 'value' );

		// For the 'numrows' setting, make sure it's an integer between 1 and 5.
		if ( 'numrows' === $setting ) {
			$value = intval( $value );
			if ( $value < 1 || $value > 5 ) {
				$value = 5;
			}
		}

		// For the 'humandate' setting, make sure it's a boolean.
		if ( 'humandate' === $setting ) {
			$value = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
		}

		// For the 'emails' setting, make sure that if it's an array then it's either an empty array or an array of email addresses.
		if ( 'emails' === $setting ) {
			if ( is_array( $value ) && ! empty( $value )) {
				$value = array_filter(
					$value,
					function( $email ) {
						return filter_var( $email, FILTER_VALIDATE_EMAIL );
					}
				);
			}
		}

		// Update the setting.
		// $result = update_option( 'test_project_option', $setting );

		return new \WP_REST_Response(
			array(
				'success' => true,
				// 'data'    => $result,
				// 'result'  => $result,
				'setting' => $setting,
				'value'   => $value,
			)
		);
	}

	/**
	 * Sanitize the update settings request.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return array
	 */
	public function sanitize_update_settings( $request ) {
		$setting = $request->get_param( 'setting' );
		$value   = $request->get_param( 'value' );

		return false;

		// Sanitize the setting.
		$setting = sanitize_text_field( $setting );

		// Sanitize the value.
		$value = sanitize_text_field( $value );

		return array(
			'setting' => $setting,
			'value'   => $value,
		);
	}

	/**
	 * Check if user has permissions to access the routes.
	 *
	 * @return bool
	 */
	public function check_permissions() {
		return current_user_can( 'manage_options' );
	}
}
