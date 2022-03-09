/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Preview from './preview';

export default function Save( { attributes } ) {
	const { align } = attributes;

	const wrapperClasses = align !== null ? 'align' + align : '';

	return (
		<div { ...useBlockProps.save( { className: wrapperClasses } ) }>
			<Preview { ...attributes } />
		</div>
	);
}
