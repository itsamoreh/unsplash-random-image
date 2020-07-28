/**
 * REGISTER: itsamoreh Unsplash Block.
 */
import edit from './edit';
import save from './save';
import icon from './icon';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

registerBlockType( 'itsamoreh/unsplash-block', {
	title: __( 'Unsplash Image', 'unsplash-block' ),
	icon: {
		src: icon,
	},
	category: 'common',
	keywords: [
		__( 'itsamoreh', 'unsplash-block' ),
		__( 'unsplash-block', 'unsplash-block' ),
	],
	attributes: {
		image: {
			type: 'string',
			default: '',
		},
		query: {
			type: 'string',
			default: '',
		},
	},
	edit,
	save,
} );
