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

import * as CsisHelpers from '../logic/CsisHelpers'
import GenericCsisTable from './GenericCsisTable'

/**
 * A Generic CSIS Client that understands the [CSIS/Drupal JSON API](https://csis.myclimateservice.eu/jsonapi/)
 * and accepts as render prop a JSX Component
 * 
 * @param {GenericCsisTableProps} props 
 * @version 0.1.0
 * @author [Pascal Dihé](https://github.com/p-a-s-c-a-l)
 * @see [Csis](https://github.com/clarity-h2020/Csis/) GitHub Project and [Csis API](https://service.Csis.at/Csis/swagger/index.html)
 * 
 * @component
 * @visibleName Generic Csis Client
 * @see GenericCsisTable
 */
const GenericCsisClient = ({ CsisUrl, CsisCredentials, render: CsisVisualisationComponent }) => {
  /**
   *  1) Either we pass just `props` and access `props.render` or
   *  we need to add `render` to the **destructuring assignment** of the argument `props`.
   *  2) We rename `render` to `CsisVisualisationComponent` using ES6 destructuring assignment syntax, because **components** must be capitalized in React.
   *  3) Instead of using a function to render dynamic children ("render props"), we use standard JSX composition in props! See https://americanexpress.io/faccs-are-an-antipattern/
   */


  // no need to lift up state because it's only used here
  // TODO: Consider using a reducer hook as explained here: https://www.robinwieruch.de/react-hooks-fetch-data/
  const [CsisData, setCsisData] = useState({ data: { rows: [], columnnames: [] }, isFetching: false });

  /**
   * Create Hook to load data from remote API when one of props CsisUrl or CsisCredentials changes
   * 
   */
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {

        // functional update form, otherwise we would have to declare CsisData as part of the array
        // and the effect would be used when *state* changes (not what we want)
        setCsisData((state) => ({ ...state, isFetching: true }));
        const response = await CsisHelpers.fetchData(CsisUrl, CsisCredentials);

        if (!ignore) {
          //qconsole.log(JSON.stringify(response));
          setCsisData((state) => ({...state, data: response.data, isFetching: false }));
        } else {
          log.warn('props changed during async call, ignoring');
        }
      } catch (error) {
        log.error('error caught in fetchData', error);
        //setCsisData((state) => ({...state,  data: { rows: [], columnnames: [] }, isFetching: false }));
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

  }, [CsisUrl, CsisCredentials]);


  return (<CsisVisualisationComponent data={CsisData.data} isFetching={false} />);
}

/**
 * GenericCsisTable Prop Types
 * 
 * @typedef {Object} GenericCsisTableProps
 */
GenericCsisClient.propTypes = {
  /**
   * URL of the Csis Endpoint
   */
  CsisUrl: PropTypes.string.isRequired,
  /**
   * The Basic Auth crendetials
   */
  CsisCredentials: PropTypes.string.isRequired,

  /**
   * The actual visualisation component to be rendered
   */
  render: PropTypes.elementType

};

/**
 * GenericCsisTable Default Props
 * @type {GenericCsisTableProps}
 */
GenericCsisClient.defaultProps = {

  CsisUrl: 'https://service.Csis.at/CsisTst/api/',
  CsisCredentials: null,
  render: GenericCsisTable
};

export default GenericCsisClient