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
				'permissions_callback' => 'is_user_logged_in',
			)
		);

		// Route to get all plugin settings.
		register_rest_route(
			'vuejs-challenge/v1',
			'/get-plugin-settings',
			array(
				'methods'              => 'GET',
				'callback'             => array( $this, 'get_plugin_settings' ),
				'permissions_callback' => 'is_user_logged_in',
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
}
