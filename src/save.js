/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Preview from './preview';

/**
 * Block Save
 *
 * @param {Object} props            Props.
 * @param {Object} props.attributes Attributes.
 *
 * @return {JSX.Element}                        Block element.
 */
export default function Save( { attributes } ) {
	const { align } = attributes;

	const wrapperClasses =
		align !== '' && align !== false ? 'align' + align : '';

	return (
		<div { ...useBlockProps.save( { className: wrapperClasses } ) }>
			<Preview { ...attributes } />
		</div>
	);
}
