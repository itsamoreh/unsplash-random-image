/**
 * EDIT: itsamoreh Unsplash Block
 */

import { useEffect } from 'react';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import Unsplash from 'unsplash-js';

import logo from './logo';

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

	useEffect( () => {

		// Get the access key from the database if it's undefined.
		if ( ! accessKey ) {
			getAccessKey();
		}

	}, [] );

	const clearError = () => {
		setAttributes( { errorMsg: undefined } );
	};

	const createNotice = ( level, message ) => {
		wp.data.dispatch( 'core/notices' ).createNotice(
			level,
			message,
			{ isDismissible: true }
		);
	};

	const postAccessKey = () => {
		return apiFetch( {
			path: '/akunsplashrandomimage/v1/access-key',
			method: 'POST',
			body: accessKey,
		} )
			.catch( ( error ) => createNotice( 'error', `${ __( 'There was an error saving your Unsplash API Access Key' ) }: "${ error.data.status } ${ error.message }"` ) );
	};

	const getAccessKey = () => {
		return apiFetch( {
			path: '/akunsplashrandomimage/v1/access-key',
			method: 'GET',
		} )
			.then( ( savedAccessKey ) => {
				setAttributes( { accessKey: savedAccessKey } );
			} )
			.catch( ( error ) => createNotice( 'error', `${ __( 'There was an error retrieving a saved Unsplash API Access Key' ) }: "${ error.data.status } ${ error.message }"` ) );
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
							<button className="button" onClick={ getPhoto }>
								{
									! image ? __( 'Get Image', 'unsplash-random-image' ) : __( 'Get New Image', 'unsplash-random-image' )
								}
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
			<img src={ image } alt="" />
		</div>
	);
};

export default Edit;
