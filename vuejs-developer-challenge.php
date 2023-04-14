<?php
/**
 * Plugin Name: VueJS Developer Challenge
 * Version: 0.0.1
 * Requires at least: 5.0
 * Requires PHP: 7.0
 * Author: David Gwyer
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Domain Path: /languages
 * Text Domain: vuejs-challenge
 *
 * @package VueJSDeveloperChallenge
 */

namespace VueJSDeveloperChallenge;

// If this file is called directly, exit.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Load the autoloader.
if ( file_exists( __DIR__ . '/lib/autoload.php' ) ) {
	require_once __DIR__ . '/lib/autoload.php';
}

// Bootstrap the plugin.
new Bootstrap( __FILE__ );

/*

Warning: include(C:\Users\dvgwy\Desktop\development\testing-stuff\vuejs-developer-applicant-challenge\includes\settings/build/index.asset.php): Failed to open stream: No such file or directory in C:\Users\dvgwy\Desktop\development\testing-stuff\vuejs-developer-applicant-challenge\includes\settings\class-plugin-settings.php on line 73

Warning: include(): Failed opening 'C:\Users\dvgwy\Desktop\development\testing-stuff\vuejs-developer-applicant-challenge\includes\settings/build/index.asset.php' for inclusion (include_path='.:/usr/share/php:/www/wp-content/pear') in C:\Users\dvgwy\Desktop\development\testing-stuff\vuejs-developer-applicant-challenge\includes\settings\class-plugin-settings.php on line 73

Warning: Trying to access array offset on value of type bool in C:\Users\dvgwy\Desktop\development\testing-stuff\vuejs-developer-applicant-challenge\includes\settings\class-plugin-settings.php on line 84

Warning: Trying to access array offset on value of type bool in C:\Users\dvgwy\Desktop\development\testing-stuff\vuejs-developer-applicant-challenge\includes\settings\class-plugin-settings.php on line 85
*/
