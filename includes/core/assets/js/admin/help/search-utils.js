/**
 * External dependencies
 */
import { deburr, differenceWith, words } from 'lodash';

/**
 * Sanitizes the search input string.
 *
 * @param {string} input The search input to normalize.
 *
 * @return {string} The normalized search input.
 */
function normalizeSearchInput( input = '' ) {
	// Disregard diacritics.
	//  Input: "média"
	input = deburr( input );

	// Accommodate leading slash, matching autocomplete expectations.
	//  Input: "/media"
	input = input.replace( /^\//, '' );

	// Lowercase.
	//  Input: "MEDIA"
	input = input.toLowerCase();

	return input;
}

/**
 * Converts the search term into a list of normalized terms.
 *
 * @param {string} input The search term to normalize.
 *
 * @return {string[]} The normalized list of search terms.
 */
export const getNormalizedSearchTerms = ( input = '' ) => {
	// Extract words.
	return words( normalizeSearchInput( input ) );
};

const removeMatchingTerms = ( unmatchedTerms, unprocessedTerms ) => {
	return differenceWith(
		unmatchedTerms,
		getNormalizedSearchTerms( unprocessedTerms ),
		( unmatchedTerm, unprocessedTerm ) =>
			unprocessedTerm.includes( unmatchedTerm )
	);
};

/**
 * Filters an item list given a search term.
 *
 * @param {Array}  items       Item list
 * @param {string} searchInput Search input.
 *
 * @return {Array} Filtered item list.
 */
export const searchItems = ( items = [], searchInput = '' ) => {
	const normalizedSearchTerms = getNormalizedSearchTerms( searchInput );
	if ( normalizedSearchTerms.length === 0 ) {
		return items;
	}

	const rankedItems = items
		.map( ( item ) => {
			return [ item, getItemSearchRank( item, searchInput ) ];
		} )
		.filter( ( [ , rank ] ) => rank > 0 );

	rankedItems.sort( ( [ , rank1 ], [ , rank2 ] ) => rank2 - rank1 );
	return rankedItems.map( ( [ item ] ) => item );
};

/**
 * Get the search rank for a given item and a specific search term.
 * The better the match, the higher the rank.
 * If the rank equals 0, it should be excluded from the results.
 *
 * @param {Object} item       Item to filter.
 * @param {string} searchTerm Search term.
 *
 * @return {number} Search Rank.
 */
export function getItemSearchRank( item, searchTerm ) {
	const title = item.title || '';
	const description = item.excerpt || '';
	const categories = item.categories || [];
	const tags = item.tags || [];

	const normalizedSearchInput = normalizeSearchInput( searchTerm );
	const normalizedName = normalizeSearchInput( title );

	let rank = 0;

	// Prefers exact matches
	// Then prefers if the beginning of the title matches the search term
	// name, keywords, categories, collection, variations match come later.
	if ( normalizedSearchInput === normalizedName ) {
		rank += 30;
	} else if ( normalizedName.startsWith( normalizedSearchInput ) ) {
		rank += 20;
	} else {
		const terms = [ title, description, ...categories, ...tags ].join(
			' '
		);
		const normalizedSearchTerms = words( normalizedSearchInput );
		const unmatchedTerms = removeMatchingTerms(
			normalizedSearchTerms,
			terms
		);

		if ( unmatchedTerms.length === 0 ) {
			rank += 10;
		}
	}

	return rank;
}
