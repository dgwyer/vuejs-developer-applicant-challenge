<?php
/**
 * Plugin Settings page.
 *
 * @package VueJSDeveloperChallenge
 */

namespace VueJSDeveloperChallenge\Settings;

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
		$opt = get_option( 'test_project_option' );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Test Project Settings', 'vuejs-challenge' ); ?></h1>
			<div id="test-project-app"></div>
			<div>Option: <?php echo esc_html( $opt ); ?></div>
		</div>
		<?php
	}
}
