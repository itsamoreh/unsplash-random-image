/**
 * EDIT: itsamoreh Unsplash Block
 */

import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import Unsplash from 'unsplash-js';

import logo from './logo';

// API request to wp_options
const unsplash = new Unsplash( { accessKey: 'zliMOHjFmFP_Wu9ilsGR5QukZTrV9NBB8OZBnlQzNaU' } );

const Edit = ( props ) => {
	const {
		attributes: {
			accessKey,
			image,
			query,
		},
		className,
		setAttributes,
		isSelected,
	} = props;

	const postAccessKey = () => {
		return apiFetch( {
			path: '/akunsplashrandomimage/v1/access-key',
			method: 'POST',
			body: accessKey,
		} )
			.catch( ( error ) => error );
	};

	const getAccessKey = () => {
		return apiFetch( {
			path: '/akunsplashrandomimage/v1/access-key',
			method: 'GET',
		} )
			.then( ( savedAccessKey ) => setAttributes( { accessKey: savedAccessKey } ) )
			.catch( ( error ) => error );
	};

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
		<div className={ className } >
			<InspectorControls>
				<PanelBody>
					<PanelRow>
						<TextControl
							label={ __( 'Unsplash API Access Key', 'unsplash-random-image' ) }
							value={ accessKey }
							onChange={ ( newAccessKey ) => setAttributes( { accessKey: newAccessKey } ) }
							onBlur={ postAccessKey }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			{
				isSelected && (
					<div className="image-select">
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
							<button className="button" onClick={ getPhoto }>{ __( 'Get Image', 'unsplash-random-image' ) }</button>
						</div>
					</div>
				)
			}
			<img src={ image } alt="" />
		</div>
	);
};

export default Edit;
