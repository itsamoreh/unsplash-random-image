<?php
/**
 * Plugin Name:     itsamoreh Unsplash Block
 * Description:     A block to get a random photo from Unsplash using the Unsplash API.
 * Version:         0.1.0
 * Author:          itsamoreh
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     unsplash-block
 *
 * @package         itsamoreh\unsplash-block
 * @since           0.1.0
 */

namespace itsamoreh\unsplash_block;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Register the block with WordPress.
 *
 * @author itsamoreh
 * @since 0.1.0
 */
function register_block() {

	// Define our assets.
	$editor_script   = 'build/index.js';
	$editor_style    = 'build/editor.css';
	$frontend_style  = 'build/style.css';
	$frontend_script = 'build/frontend.js';

	// Verify we have an editor script.
	if ( ! file_exists( plugin_dir_path( __FILE__ ) . $editor_script ) ) {
		wp_die( esc_html__( 'Whoops! You need to run `npm run build` for the itsamoreh Unsplash Block first.', 'unsplash-block' ) );
	}

	// Autoload dependencies and version.
	$asset_file = require plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	// Register editor script.
	wp_register_script(
		'unsplash-block-editor-script',
		plugins_url( $editor_script, __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	// Register editor style.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $editor_style ) ) {
		wp_register_style(
			'unsplash-block-editor-style',
			plugins_url( $editor_style, __FILE__ ),
			[ 'wp-edit-blocks' ],
			filemtime( plugin_dir_path( __FILE__ ) . $editor_style )
		);
	}

	// Register frontend style.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $frontend_style ) ) {
		wp_register_style(
			'unsplash-block-style',
			plugins_url( $frontend_style, __FILE__ ),
			[],
			filemtime( plugin_dir_path( __FILE__ ) . $frontend_style )
		);
	}

	// Register block with WordPress.
	register_block_type( 'itsamoreh/unsplash-block', array(
		'editor_script' => 'unsplash-block-editor-script',
		'editor_style'  => 'unsplash-block-editor-style',
		'style'         => 'unsplash-block-style',
	) );

	// Register frontend script.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $frontend_script ) ) {
		wp_enqueue_script(
			'unsplash-block-frontend-script',
			plugins_url( $frontend_script, __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}
}
add_action( 'init', __NAMESPACE__ . '\register_block' );

define( 'AK_INSERT_UNSPLASH_BLOCK_REST_NAMESPACE', 'akinsertunsplashblock/v1' );
define( 'AK_INSERT_GIPHY_BLOCK_API_KEY', 'ak_insert_unsplash_block_api_key' );

/**
 * Register custom WP Rest Endpoints to fetch and save the API Key.
 *
 * @author itsamoreh
 * @since 0.1.0
 */
function rest_endpoint() {
	register_rest_route(
		AK_INSERT_UNSPLASH_BLOCK_REST_NAMESPACE,
		'api-key/',
		[
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => __NAMESPACE__ . '\rest_get_api_key',
			'permission_callback' => __NAMESPACE__ . '\rest_check_permission',
		]
	);

	register_rest_route(
		AK_INSERT_UNSPLASH_BLOCK_REST_NAMESPACE,
		'api-key/',
		[
			'methods'             => \WP_REST_Server::EDITABLE,
			'callback'            => __NAMESPACE__ . '\rest_update_api_key',
			'permission_callback' => __NAMESPACE__ . '\rest_check_permission',
		]
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\rest_endpoint' );
