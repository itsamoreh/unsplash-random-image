/**
 * EDIT: itsamoreh Unsplash Block
 */

import { __ } from '@wordpress/i18n';
import { TextControl } from '@wordpress/components';
import Unsplash from 'unsplash-js';

import Controls from './controls';
import logo from './logo';
import icon from './icon';

const Edit = ( props ) => {
	const {
		attributes: {
			accessKey,
			errorMsg,
			image,
			query,
		},
		className,
		setAttributes,
		isSelected,
	} = props;

	const clearError = () => {
		setAttributes( { errorMsg: undefined } );
	};

	const getPhoto = () => {
		const unsplash = new Unsplash( { accessKey } );

		clearError();

		unsplash.photos.getRandomPhoto( { query } )
			.then( ( res ) => res.json() )
			.then( ( json ) => {

				if ( json.errors ) {
					setAttributes( { errorMsg: json.errors[ 0 ] } );
				} else {
					setAttributes( {
						image: json.urls.small,
					} );
				}

			} );
	};

	return (
		<div className={ className } >
			<Controls { ...props } />
			{
				isSelected && (
					<div className="image-select-box">
						<div className="logo">
							{ logo }
						</div>
						<div className="image-select-form">
							<TextControl
								className="query"
								placeholder={ __( 'Query (optional)', 'unsplash-random-image' ) }
								value={ query }
								onChange={ ( newQuery ) => setAttributes( { query: newQuery } ) }
							/>
							<button className="button" onClick={ getPhoto }>
								{ ! image ? __( 'Get Image', 'unsplash-random-image' ) : __( 'Get New Image', 'unsplash-random-image' ) }
							</button>
						</div>
						{
							errorMsg && (
								<span className="error-message">{ errorMsg }</span>
							)
						}
					</div>
				)
			}
			{
				image ? <img src={ image } alt="" /> :
					(
						<div className="block-placeholder">
							<span className="text">
								{ __( 'Click "Get Image" to get an image!', 'unsplash-random-image' ) }
							</span>
							{ icon }
						</div>
					)
			}
		</div>
	);
};

export default Edit;
