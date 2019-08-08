/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

// Import React Table
import ReactTable from 'react-table';
import "react-table/react-table.css";

import * as EMIKATHelpers from '../logic/EMIKATHelpers'

// React Arrow Function Component
// see https://www.robinwieruch.de/react-function-component/#react-arrow-function-component

// {data, isFetching} -> destructuring for props.data, props.isFetching, 
// see https://www.robinwieruch.de/react-pass-props-to-component/#react-props-code-style

/**
 * A Generic Table Component that understand the 'special' JSON format of the [EMIKAT API](https://service.emikat.at/EmiKat/swagger/index.html).
 * 
 * @param {GenericEmikatTableProps} props 
 * @version 0.1.0
 * @author [Pascal Dihé](https://github.com/p-a-s-c-a-l)
 * @see [EMIKAT](https://github.com/clarity-h2020/emikat/) GitHub Project and [EMIKAT API](https://service.emikat.at/EmiKat/swagger/index.html)
 * 
 * @component
 * @visibleName Generic EMIKAT Table
 */
const GenericEmikatTable = ({ data, isFetching, generateColumns }) => {

    //useEffect(() => { console.log('data:' + data + ' / isFetching: ' + isFetching) }, [data, isFetching]);
    useEffect(() => console.log(data + 'value changed!'), [data]);

    return (
        <ReactTable
            data={data.rows}
            columns={generateColumns(data.columnnames)}
            loading={isFetching}
            defaultPageSize={10}
        />);
}

/*const columns = [{
    Header: 'ID',
    accessor: 'id', // String-based value accessors!
    Cell: (props) => <span className='number'>{props.value}</span> // Custom cell components!
}, {
    Header: 'Name',
    accessor: 'Name',
}, {
    id: 'street', // Required because our accessor is not a string
    Header: 'street',
    accessor: row => row.address.street // Custom value accessors!
}, {
    Header: (props) => <span>Phone</span>, // Custom header components!
    accessor: 'phone'
}]*/

/**
 * GenericEmikatTable Prop Types
 * 
 * @typedef {Object} GenericEmikatTableProps
 */
GenericEmikatTable.propTypes = {
    data: PropTypes.object.isRequired,
    /**
     * Show the loading indicator. Useful, is data is loaded asynchronously
     */
    isFetching: PropTypes.bool,

    generateColumns: PropTypes.func
};

/**
 * GenericEmikatTable Default Props
 * @type {GenericEmikatTableProps}
 */
GenericEmikatTable.defaultProps = {
    /**
     * User array (demo only)
     */
    data: [{ columns: [] }, { rows: [] }],
    /**
     * @type {bool}
     */
    isFetching: true,

    generateColumns: EMIKATHelpers.generateColumns
};

export default GenericEmikatTable