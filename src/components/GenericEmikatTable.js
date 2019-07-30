import React, { useEffect } from 'react';
import PropTypes from "prop-types";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

// React Arrow Function Component
// see https://www.robinwieruch.de/react-function-component/#react-arrow-function-component

// {data, isFetching} -> destructuring for props.data, props.isFetching, 
// see https://www.robinwieruch.de/react-pass-props-to-component/#react-props-code-style
const GenericEmikatTable = ({ users, isFetching }) => {

    //useEffect(() => { console.log('users:' + users + ' / isFetching: ' + isFetching) }, [users, isFetching]);

    return (
        <ReactTable
            data={users}
            columns={columns}
            loading={isFetching}
        />);
}

const columns = [{
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
}]

GenericEmikatTable.propTypes = {
    users: PropTypes.array.isRequired,
    isFetching: PropTypes.bool
};

GenericEmikatTable.defaultProps = {
    users: [],
    isFetching: true
};

export default GenericEmikatTable