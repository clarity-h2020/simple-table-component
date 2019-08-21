/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import log from 'loglevel';
import {EMIKATHelpers} from 'csis-helpers-js';
import GenericEmikatTable from './../components/GenericEmikatTable'

/**
 * A Generic EMIKAT Client that understands the [EMIKAT API](https://service.emikat.at/EmiKat/swagger/index.html)
 * and accepts as render prop a JSX Component, e.g. <GenericEmikatTable>
 * 
 * @param {GenericEmikatClientProps} props 
 * @version 0.1.0
 * @author [Pascal Dihé](https://github.com/p-a-s-c-a-l)
 * @see [EMIKAT](https://github.com/clarity-h2020/emikat/) GitHub Project and [EMIKAT API](https://service.emikat.at/EmiKat/swagger/index.html)
 * 
 * @component
 * @visibleName Generic EMIKAT Client
 * @see GenericEmikatTable
 */
const GenericEmikatClient = ({ emikatUrl, emikatCredentials, render: EmikatVisualisationComponent }) => {
  /**
   *  1) Either we pass just `props` and access `props.render` or
   *  we need to add `render` to the **destructuring assignment** of the argument `props`.
   *  2) We rename `render` to `EmikatVisualisationComponent` using ES6 destructuring assignment syntax, because **components** must be capitalized in React.
   *  3) Instead of using a function to render dynamic children ("render props"), we use standard JSX composition in props! See https://americanexpress.io/faccs-are-an-antipattern/
   */


  // no need to lift up state because it's only used here
  // TODO: Consider using a reducer hook as explained here: https://www.robinwieruch.de/react-hooks-fetch-data/
  const [emikatData, setEmikatData] = useState({ data: { rows: [], columnnames: [] }, isFetching: false });

  /**
   * Create Hook to load data from remote API when one of props emikatUrl or emikatCredentials changes
   * 
   */
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {

        // functional update form, otherwise we would have to declare emikatData as part of the array
        // and the effect would be used when *state* changes (not what we want)
        setEmikatData((state) => ({ ...state, isFetching: true }));
        const response = await EMIKATHelpers.fetchData(emikatUrl, emikatCredentials);

        if (!ignore) {
          //qconsole.log(JSON.stringify(response));
          setEmikatData((state) => ({...state, data: response.data, isFetching: false }));
        } else {
          log.warn('props changed during async call, ignoring');
        }
      } catch (error) {
        log.error('error caught in fetchData', error);
        //setEmikatData((state) => ({...state,  data: { rows: [], columnnames: [] }, isFetching: false }));
        throw error;
      }
    };

    fetchData();

    /**
     * clean up function which runs when a component unmounts
     */
    return function cleanup() {
      console.log('cleanup data fetching');
      ignore = true;
    };

  }, [emikatUrl, emikatCredentials]);


  return (<EmikatVisualisationComponent data={emikatData.data} isFetching={false} />);
}

/**
 * GenericEmikatTable Prop Types
 * 
 * @typedef {Object} GenericEmikatTableProps
 */
GenericEmikatClient.propTypes = {
  /**
   * URL of the EMIKAT Endpoint
   */
  emikatUrl: PropTypes.string.isRequired,
  /**
   * The Basic Auth crendetials
   */
  emikatCredentials: PropTypes.string.isRequired,

  /**
   * The actual visualisation component to be rendered
   */
  render: PropTypes.elementType

};

/**
 * GenericEmikatTable Default Props
 * @typedef {Object} GenericEmikatClientProps
 */
GenericEmikatClient.defaultProps = {

  emikatUrl: 'https://service.emikat.at/EmiKatTst/api/',
  emikatCredentials: null,
  render: GenericEmikatTable
};

export default GenericEmikatClient