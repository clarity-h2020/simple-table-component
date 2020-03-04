/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

import React from 'react';
import log from 'loglevel';
import GenericEmikatTable from './GenericEmikatTable.js';

import 'react-table/react-table.css';

/**
 * An Exposure EMIKAT Table Component that understands the 'special' JSON format of the [EMIKAT API](https://service.emikat.at/EmiKat/swagger/index.html).
 * This component is currently not needed, as there are no customisations required. Furthermore, EMIKAT APIs allows to restrict the result to certain columns,
 * therefore there is actually no real need to overwrite generateColums. See also comments in HazardLocalEffectsTable.
 * 
 * @param {GenericEmikatTableProps} props 
 * @version 0.1.0
 * @author [Pascal Dihé](https://github.com/p-a-s-c-a-l)
 * @see [EMIKAT](https://github.com/clarity-h2020/emikat/) GitHub Project and [EMIKAT API](https://service.emikat.at/EmiKat/swagger/index.html)
 * 
 * @component
 * @visibleName Generic EMIKAT Table
 */
const ExposureEmikatTable = ({ data, isFetching }) => {
	log.info('creating new ExposureEmikatTable');

	// OK, this is actually nothing new, because the exposure tables contains just two columns and there is not much customisation to be done here ;-)
	const generateColumns = GenericEmikatTable.generateColumns;

	return <GenericEmikatTable data={data} isFetching={isFetching} generateColumns={generateColumns} />;
};

/**
 * ExposureEmikatTable Prop Types
 * 
 * @typedef {Object} ExposureEmikatTable
 */
ExposureEmikatTable.propTypes = GenericEmikatTable.propTypes;

/**
 * ExposureEmikatTable Default Props
 * @type {GenericEmikatTableProps}
 */
ExposureEmikatTable.defaultProps = {
	...GenericEmikatTable.defaultProps,
	generateColumns: ExposureEmikatTable.generateColumns
};

export default ExposureEmikatTable;
