/**
 * EDIT: itsamoreh Unsplash Block
 */

import logo from './logo';

import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Unsplash from 'unsplash-js';

// API request to wp_options
const unsplash = new Unsplash( { accessKey: 'zliMOHjFmFP_Wu9ilsGR5QukZTrV9NBB8OZBnlQzNaU' } );

const Edit = ( props ) => {
	const {
		attributes: {
			image,
			query,
		},
		className,
		setAttributes,
		isSelected,
	} = props;

	const getPhoto = () => {
		unsplash.photos.getRandomPhoto( { query } )
			.then( ( res ) => res.json() )
			.then( ( json ) => {
				setAttributes( {
					image: json.urls.small,
				} );
			} );
	};

	return (
		<div
			className={ className }
		>
			{
				isSelected && (
					<div className="image-select">
						<div className="logo">
							{ logo }
						</div>
						<div className="image-select-form">
							<TextControl
								className="query"
								placeholder={ __( 'Query (optional)' ) }
								value={ query }
								onChange={ ( newQuery ) => setAttributes( { query: newQuery } ) }
							/>
							<button className="button" onClick={ getPhoto }>{ __( 'Get Image' ) }</button>
						</div>
					</div>
				)
			}
			<img src={ image } alt="" />
		</div>
	);
};

export default Edit;
