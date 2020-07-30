<?php
/**
 * Plugin Name:     Unsplash Random Image
 * Description:     A Gutenberg block that will get a random photo from Unsplash. Requires an Unsplash API access key.
 * Version:         0.1.0
 * Author:          itsamoreh
 * License:         GPL-3.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-3.0
 * Text Domain:     unsplash-random-image
 *
 * @package         itsamoreh\unsplash-random-image
 * @since           0.1.0
 */

namespace itsamoreh\unsplash_random_image;

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
		wp_die( esc_html__( 'Whoops! You need to run `npm run build` for the Unsplash Random Image block first.', 'unsplash-random-image' ) );
	}

	// Autoload dependencies and version.
	$asset_file = require plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	// Register editor script.
	wp_register_script(
		'unsplash-random-image-editor-script',
		plugins_url( $editor_script, __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	// Register editor style.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $editor_style ) ) {
		wp_register_style(
			'unsplash-random-image-editor-style',
			plugins_url( $editor_style, __FILE__ ),
			[ 'wp-edit-blocks' ],
			filemtime( plugin_dir_path( __FILE__ ) . $editor_style )
		);
	}

	// Register frontend style.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $frontend_style ) ) {
		wp_register_style(
			'unsplash-random-image-style',
			plugins_url( $frontend_style, __FILE__ ),
			[],
			filemtime( plugin_dir_path( __FILE__ ) . $frontend_style )
		);
	}

	// Register block with WordPress.
	register_block_type( 'itsamoreh/unsplash-random-image', array(
		'editor_script' => 'unsplash-random-image-editor-script',
		'editor_style'  => 'unsplash-random-image-editor-style',
		'style'         => 'unsplash-random-image-style',
	) );

	// Register frontend script.
	if ( file_exists( plugin_dir_path( __FILE__ ) . $frontend_script ) ) {
		wp_enqueue_script(
			'unsplash-random-image-frontend-script',
			plugins_url( $frontend_script, __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}
}
add_action( 'init', __NAMESPACE__ . '\register_block' );

define( 'AK_UNSPLASH_RANDOM_IMAGE_REST_NAMESPACE', 'akunsplashrandomimage/v1' );
define( 'AK_UNSPLASH_RANDOM_IMAGE_ACCESS_KEY', 'ak_unsplash_random_image_access_key' );

/**
 * Register custom WP Rest Endpoints to fetch and save the API Key.
 *
 * @author itsamoreh
 * @since 0.1.0
 */
function rest_endpoint() {
	register_rest_route(
		AK_UNSPLASH_RANDOM_IMAGE_REST_NAMESPACE,
		'access-key/',
		[
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => __NAMESPACE__ . '\rest_get_access_key',
			'permission_callback' => __NAMESPACE__ . '\rest_check_permission',
		]
	);

	register_rest_route(
		AK_UNSPLASH_RANDOM_IMAGE_REST_NAMESPACE,
		'access-key/',
		[
			'methods'             => \WP_REST_Server::EDITABLE,
			'callback'            => __NAMESPACE__ . '\rest_update_access_key',
			'permission_callback' => __NAMESPACE__ . '\rest_check_permission',
		]
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\rest_endpoint' );

/**
 * Register custom WP Rest Endpoints to fetch and save the API Key.
 *
 * @author itsamoreh
 * @since 0.1.0
 */
function rest_get_access_key() {
	$response = new \WP_REST_Response( get_option( AK_UNSPLASH_RANDOM_IMAGE_ACCESS_KEY, '' ) );
	$response->set_status( 200 );

	return $response;
}

/**
 * Register custom WP Rest Endpoints to fetch and save the API Key.
 *
 * @author itsamoreh
 * @since 0.1.0
 */
function rest_update_access_key( $request ) {
	$saved_access_key = update_option( AK_UNSPLASH_RANDOM_IMAGE_ACCESS_KEY, $request->get_body() );

	$response = new \WP_REST_Response( $saved_access_key );
	$response->set_status( 201 );

	return $response;
}

/**
 * Make the custom REST endpoint private and accessible on to users that can `edit_posts`.
 *
 * @author itsamoreh
 * @since 0.1.0
 * @return bool
 */
function rest_check_permission() {
	return current_user_can( 'edit_posts' );
}
