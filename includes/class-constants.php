<?php
/**
 * Plugin constants.
 *
 * @package VueJSDeveloperChallenge
 */

namespace VueJSDeveloperChallenge;

/**
 * Constants class.
 */
class Constants {

	/**
	 * Plugin paths/directories.
	 *
	 * @var array
	 */
	public static $plugin_roots = array();

	/**
	 * Main class constructor.
	 *
	 * @param string $file The main plugin file.
	 */
	public function __construct( $file ) {
		// Plugin paths/directories.
		self::$plugin_roots = array(
			'plugin_dir_path' => plugin_dir_path( $file ),
			'plugin_dir_url'  => plugin_dir_url( $file ),
			'plugin_url'      => plugins_url( '', $file ),
		);
	}
}
