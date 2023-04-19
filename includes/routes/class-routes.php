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
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_api_data' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			)
		);

		// Route to get fresh data from an external API.
		register_rest_route(
			'vuejs-challenge/v1',
			'/refresh-api-data',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'refresh_api_data' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			)
		);

		// Route to get all plugin settings.
		register_rest_route(
			'vuejs-challenge/v1',
			'/get-plugin-settings',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_plugin_settings' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			)
		);

		// Route to set an individual setting.
		register_rest_route(
			'vuejs-challenge/v1',
			'/update-setting/(?P<setting>\w+)',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_setting' ),
				'permission_callback' => array( $this, 'check_permissions' ),
				'args'                => array(
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
	 * Get fresh data from an external API.
	 *
	 * @return mixed
	 */
	public function refresh_api_data() {
		return $this->get_api_data( true );
	}

	/**
	 * Get data from an external API no more than once per hour unless specified.
	 *
	 * @param bool $refresh Whether to refresh the data or not.
	 *
	 * @return mixed
	 */
	public function get_api_data( $refresh = false ) {
		if ( true === $refresh ) {
			// If the data should be refreshed, delete the cached data.
			delete_transient( 'get_api_data' );
		}

		$cache_key   = 'get_api_data';
		$cached_data = get_transient( $cache_key );

		if ( false === $cached_data ) {
			// If data is not cached, retrieve the data from external API.
			$response = wp_remote_get( 'https://miusage.com/v1/challenge/2/static/' );

			// Check if the API call was successful.
			if ( ! is_wp_error( $response ) && wp_remote_retrieve_response_code( $response ) === 200 ) {
				// Get the API response body.
				$api_response = wp_remote_retrieve_body( $response );

				// Store the API response in cache for up to 1 hour.
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
		$options = json_decode( get_option( 'test_project_option' ), true );

		// For the 'numrows' setting, make sure it's an integer between 1 and 5.
		if ( 'numrows' === $setting ) {
			$value = intval( $value );
			if ( $value < 1 || $value > 5 ) {
				$value = 5;
			}
			$options['numrows'] = $value;
		}

		// For the 'humandate' setting, make sure it's a boolean.
		if ( 'humandate' === $setting ) {
			$value                = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
			$options['humandate'] = $value;
		}

		// For the 'emails' setting, make sure that if it's an array then it's either an empty array or an array of email addresses.
		if ( 'emails' === $setting ) {
			if ( is_array( $value ) && ! empty( $value ) ) {
				$value = array_filter(
					$value,
					function( $email ) {
						return filter_var( $email, FILTER_VALIDATE_EMAIL );
					}
				);
			}
			$options['emails'] = $value;
		}

		// Update the setting and return if successful or not.
		$result = update_option( 'test_project_option', wp_json_encode( $options ) );

		return new \WP_REST_Response(
			array(
				'success' => $result,
				'setting' => $setting,
				'value'   => $value,
				'options' => $options,
			)
		);
	}

	/**
	 * Check if user has permissions to access the routes.
	 *
	 * @return bool
	 */
	public function check_permissions() {
		if ( isset( $_SERVER['HTTP_X_WP_NONCE'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_WP_NONCE'] ) ), 'wp_rest' ) ) {
			return \current_user_can( 'manage_options' );
		}

		return current_user_can( false );
	}
}
