/**
 * WordPress dependencies
 */
import { edit, globe } from '@wordpress/icons';
import { BlockControls, useBlockProps } from '@wordpress/block-editor';
import {
	ComboboxControl,
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import countries from '../assets/countries.json';
import { getEmojiFlag } from './utils';
import Preview from './preview';
import './editor.scss';

/**
 * Block Edit
 *
 * @param {Object}   props                         Props.
 * @param {Object}   props.attributes              Attributes.
 * @param {Function} props.setAttributes           Set attributes.
 * @param {string}   props.attributes.align        alignment.
 * @param {string}   props.attributes.countryCode  Country Code.
 * @param {Array}    props.attributes.relatedPosts Related posts array.
 *
 * @return {JSX.Element} Block element.
 */
export default function Edit( props ) {
	const {
		attributes: { countryCode, relatedPosts },
		setAttributes,
	} = props;

	const options = Object.keys( countries ).map( ( code ) => ( {
		value: code,
		label: getEmojiFlag( code ) + '  ' + countries[ code ] + ' — ' + code,
	} ) );

	const handleChangeCountry = () => {
		setAttributes( {
			countryCode: false,
			relatedPosts: [],
		} );
	};

	const handleChangeCountryCode = ( newCountryCode ) => {
		if ( newCountryCode && countryCode !== newCountryCode ) {
			setAttributes( {
				countryCode: newCountryCode,
				relatedPosts: [],
			} );
		}
	};

	const blockProps = useBlockProps();

	useEffect( () => {
		async function getRelatedPosts() {
			const postId = window.location.href.match( /post=([\d]+)/ )[ 1 ];
			const response = await window.fetch(
				`/wp-json/wp/v2/posts?search=${ countries[ countryCode ] }&exclude=${ postId }&_fields=title,link,excerpt`
			);

			if ( ! response.ok )
				throw new Error( `HTTP error! Status: ${ response.status }` );

			const posts = await response.json();

			setAttributes( {
				relatedPosts:
					posts?.map( ( relatedPost ) => ( {
						...relatedPost,
						title: relatedPost.title?.rendered || relatedPost.link,
						excerpt: relatedPost.excerpt?.rendered || '',
					} ) ) || [],
			} );
		}

		getRelatedPosts();
	}, [ countryCode, setAttributes ] );

	if ( countryCode ) {
		return (
			<div { ...blockProps }>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Change Country', 'xwp-country-card' ) }
							icon={ edit }
							onClick={ handleChangeCountry }
						/>
					</ToolbarGroup>
				</BlockControls>
				<Preview
					countryCode={ countryCode }
					relatedPosts={ relatedPosts }
				/>
			</div>
		);
	}

	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ globe }
				label={ __( 'XWP Country Card', 'xwp-country-card' ) }
				isColumnLayout={ true }
				instructions={ __(
					'Type in a name of a contry you want to display on you site.',
					'xwp-country-card'
				) }
			>
				<ComboboxControl
					label={ __( 'Country', 'xwp-country-card' ) }
					hideLabelFromVision
					options={ options }
					value={ countryCode }
					onChange={ handleChangeCountryCode }
					allowReset={ true }
				/>
			</Placeholder>
		</div>
	);
}
