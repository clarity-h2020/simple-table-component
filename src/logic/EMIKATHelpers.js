/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

import axios from 'axios';

export const EMIKAT_STUDY_ID = '$emikat_id';

const emikatClient = axios.create();

export async function fetchData(url, emikatCredentials) {
  try {

    console.log('fetching from EMIKAT:' + url);

    const response = await emikatClient.get(url, { headers: { Authorization: emikatCredentials } });

    // we *could* do once:  
    // emikatClient.defaults.headers.common['Authorization'] = emikatCredentials;
    // but that would break functional code as it has side effects on the emikatClient instance.

    return response;

  } catch (e) {
    console.error('could not fetach EMIKAT data from ' + url, e);
    throw e;
  }
};

export async function fetchUsers(url, authString) {
  try {
    console.log('fetching from:' + url);
    const response = await emikatClient.get(url, { headers: { Authorization: authString } });

    // we *could* do once:  
    emikatClient.defaults.headers.common['Authorization'] = authString;
    // but that would break functional code as it has side effects on the emikatClient instance.

    //console.log(JSON.stringify(response));
    return response;

  } catch (e) {
    console.error(e);
    throw e;
  }
};

/**
 * Replaces EMIKAT_STUDY_ID with the actual study id.
 * Note: We *could* use template strings in a fixed URL,  e.g.
 * `https://service.emikat.at/EmiKatTst/api/scenarios/${emikat_id}/feature/view.2812/table/data`
 * However, this has to many drawbacks
 * 
 * @param {string} urlTemplate 
 * @param {number} emikatId 
 */
export function addEmikatId(urlTemplate, emikatId) {
  let url = urlTemplate.replace(EMIKAT_STUDY_ID, emikatId);
  return url;
}

/**
 * Generates a simple column defintion for ReactTable from EMIKAT tabular Data
 * 
 * @param {Object[]} columns 
 * @return {Object[]}
 */
export function generateColumns(columnnames) {

  // add parentheses around the entire body `({})` to force the parser to treat the object literal 
  // as an expression so that it's not treated as a block statement.
  return columnnames.map((columnname, index) => ({
    id: columnname, // Required because our accessor is not a string
    Header: columnname,
    accessor: row => row.values[index] // Custom value accessors!
  }));
}


export function sum(a, b) {
  return a + b;
}


/**
 * We can either use "import EMIKATHelpers from './EMIKATHelpers.js'" and call  "EMIKATHelpers.getIncludedObject(...)" or
 * "import {getIncludedObject} from './EMIKATHelpers.js'" and call "getIncludedObject(...)".
 */