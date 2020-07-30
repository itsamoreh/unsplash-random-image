/**
 * REGISTER: itsamoreh Unsplash Block.
 */
import edit from './edit';
import save from './save';
import icon from './icon';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

registerBlockType( 'itsamoreh/unsplash-random-image', {
	title: __( 'Unsplash Image', 'unsplash-random-image' ),
	icon: {
		src: icon,
	},
	category: 'common',
	keywords: [
		__( 'itsamoreh', 'unsplash-random-image' ),
		__( 'unsplash-random-image', 'unsplash-random-image' ),
	],
	attributes: {
		image: {
			type: 'string',
			default: null,
		},
		query: {
			type: 'string',
			default: '',
		},
	},
	edit,
	save,
} );
