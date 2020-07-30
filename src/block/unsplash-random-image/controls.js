/**
 * CONTROLS: itsamoreh Unsplash Block
 */

import { useEffect } from 'react';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

const Controls = ( props ) => {
	const { attributes, setAttributes } = props;
	const { accessKey, isSelected } = attributes;

	useEffect( () => {
		getAccessKey();
	}, [ isSelected ] );

	const createNotice = ( level, message ) => {
		wp.data.dispatch( 'core/notices' ).createNotice(
			level,
			message,
			{ isDismissible: true }
		);
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

	const postAccessKey = () => {
		return apiFetch( {
			path: '/akunsplashrandomimage/v1/access-key',
			method: 'POST',
			body: accessKey,
		} )
			.catch( ( error ) => createNotice( 'error', `${ __( 'There was an error saving your Unsplash API Access Key' ) }: "${ error.data.status } ${ error.message }"` ) );
	};

	return (
		<InspectorControls>
			<PanelBody>
				<PanelRow>
					<TextControl
						label={ __( 'Unsplash API Access Key', 'unsplash-random-image' ) }
						help={ 'https://unsplash.com/developers' }
						value={ accessKey }
						onChange={ ( newAccessKey ) => setAttributes( { accessKey: newAccessKey } ) }
						onBlur={ postAccessKey }
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
};

export default Controls;
