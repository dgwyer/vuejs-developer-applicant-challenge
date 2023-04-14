<?php
/**
 * Plugin Settings page.
 *
 * @package VueJSDeveloperChallenge
 */

namespace VueJSDeveloperChallenge\Settings;

use VueJSDeveloperChallenge\Constants;

/**
 * Settings class.
 */
class Plugin_Settings {

	/**
	 * Main class constructor.
	 */
	public function __construct() {
		add_action( 'admin_init', array( $this, 'register_plugin_settings' ) );
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'load_admin_scripts' ) );
	}

	/**
	 * Register plugin settings via the Settings API.
	 */
	public function register_plugin_settings() {
		register_setting( 'test_project_option_group', 'test_project_option' );
	}

	/**
	 * Register plugin options page.
	 */
	public function add_options_page() {
		add_menu_page(
			__( 'Test Project Settings Page', 'vuejs-challenge' ),
			__( 'Test Project', 'vuejs-challenge' ),
			'manage_options',
			'test-project-menu',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Render the plugin options page.
	 */
	public function render_settings_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Test Project Settings', 'vuejs-challenge' ); ?></h1>
			<div id="test-project-app"></div>
			<div class="hide-if-js">
				<?php esc_html_e( 'This page requires JavaScript to be enabled in your browser.', 'vuejs-challenge' ); ?>
			</div>
		</div>
		<?php
	}

	/**
	 * Load admin scripts.
	 *
	 * @param string $hook The current admin page.
	 */
	public function load_admin_scripts( $hook ) {

		// Load scripts only on plugin settings page.
		if ( 'toplevel_page_test-project-menu' !== $hook ) {
			return;
		}

		// Script dependencies.
		$asset_file = include Constants::$plugin_roots['plugin_dir_path'] . 'build/index.asset.php';

		// Enqueue script.
		wp_enqueue_script(
			'test-project-app-js',
			plugins_url( 'build/index.js', Constants::$plugin_roots['file'] ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		wp_add_inline_script(
			'test-project-app-js',
			'window.testProjectApp = ' . \wp_json_encode(
				array(
					'site' => \esc_url_raw( \get_site_url() ),
				)
			),
			'before'
		);

		// Enqueue style.
		wp_enqueue_style(
			'test-project-app-css',
			plugins_url( 'build/index.css', Constants::$plugin_roots['file'] ),
			array(),
			$asset_file['version']
		);
	}
}
