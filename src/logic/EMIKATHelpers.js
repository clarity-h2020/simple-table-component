import axios from 'axios';

export const EMIKAT_STUDY_ID = '$emikat_id';


export async function fetchUsers(url) {
  try {
    console.log('fetching from:' + url);
    const response = await axios.get(url);

    //console.log(JSON.stringify(response));
    return response;

  } catch (e) {
    console.error(e);
    throw e;
  }
};

/**
 * Replaces EMIKAT_STUDY_ID with the actual study id
 * 
 * @param {string} urlTemplate 
 * @param {number} emikatId 
 */
export function addEmikatId(urlTemplate, emikatId) {
  let url = urlTemplate.replace(EMIKAT_STUDY_ID, emikatId);
  return url;
}


export function sum(a, b) {
  return a + b;
}


/**
 * We can either use "import EMIKATHelpers from './EMIKATHelpers.js'" and call  "EMIKATHelpers.getIncludedObject(...)" or
 * "import {getIncludedObject} from './EMIKATHelpers.js'" and call "getIncludedObject(...)". 
 */