/**
 * CONTROLS: itsamoreh Unsplash Block
 */

import { Button, PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

const Controls = ( props ) => {
	const { attributes, setAttributes } = props;
	const { accessKey, isEditing = false } = attributes;

	const createNotice = ( level, message ) => {
		wp.data.dispatch( 'core/notices' ).createNotice(
			level,
			message,
			{ isDismissible: true }
		);
	};

	const toggleEditMode = () => {
		setAttributes( { isEditing: ! isEditing } );
	};

	const getAccessKey = async () => {
		try {
			const savedAccessKey = await apiFetch( {
				path: '/akunsplashrandomimage/v1/access-key',
				method: 'GET',
			} );
			setAttributes( { accessKey: savedAccessKey } );
		} catch ( error ) {
			return createNotice( 'error', `${ __( 'There was an error retrieving a saved Unsplash API Access Key' ) }: "${ error.data.status } ${ error.message }"` );
		}
	};

	const postAccessKey = async () => {
		try {
			return apiFetch( {
				path: '/akunsplashrandomimage/v1/access-key',
				method: 'POST',
				body: accessKey,
			} );
		} catch ( error ) {
			return createNotice( 'error', `${ __( 'There was an error saving your Unsplash API Access Key' ) }: "${ error.data.status } ${ error.message }"` );
		}
	};

	return (
		<InspectorControls>
			<PanelBody>
				{
					isEditing ? (
						<>
							<PanelRow>
								<TextControl
									label={ __( 'Unsplash API Access Key', 'unsplash-random-image' ) }
									help={ 'https://unsplash.com/developers' }
									value={ accessKey }
									onChange={ ( newAccessKey ) => setAttributes( { accessKey: newAccessKey } ) }
									onBlur={ postAccessKey }
								/>
							</PanelRow>
							<PanelRow className="save-buttons">
								<Button isSecondary onClick={ toggleEditMode }>{ __( 'Cancel' ) }</Button>
								<Button isPrimary onClick={ () => {
									postAccessKey();
									toggleEditMode();
								} }
								>
									{ __( 'Save Key' ) }
								</Button>
							</PanelRow>
						</>
					) : (
						<PanelRow>
							<Button isPrimary onClick={ () => {
								getAccessKey();
								toggleEditMode();
							} }
							>
								{ __( 'Edit API Access Key' ) }
							</Button>
						</PanelRow>
					)
				}
			</PanelBody>
		</InspectorControls>
	);
};

export default Controls;
