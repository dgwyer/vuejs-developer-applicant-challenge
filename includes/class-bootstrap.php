<?php
/**
 * Bootstrap plugin files.
 *
 * @package VueJSDeveloperChallenge
 */

namespace VueJSDeveloperChallenge;

use VueJSDeveloperChallenge\Settings\Plugin_Settings;
use VueJSDeveloperChallenge\Routes\Routes;

/**
 * Bootstrap class.
 */
class Bootstrap {

	/**
	 * Main class constructor.
	 *
	 * @param string $file The main plugin file.
	 */
	public function __construct( $file ) {
		register_activation_hook( $file, array( $this, 'on_activation' ) );

		new Constants( $file );
		new Plugin_Settings();
		new Routes();
	}

	/**
	 * Initialize plugin settings on plugin activation (if they don't already exist).
	 */
	public function on_activation() {
		$defaults = array(
			'numrows'   => 5,
			'humandate' => true,
			'emails'    => array( get_option( 'admin_email' ) ),
		);

		if ( ! get_option( 'test_project_option' ) ) {
			update_option( 'test_project_option', wp_json_encode( $defaults ) );
		}
	}
}
