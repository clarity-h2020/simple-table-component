import Wkt from 'wicket';

/**
 * Be aware of the difference between default and named exports. It is a common source of mistakes.
 * We suggest that you stick to using default imports and exports when a module only exports a single thing (for example, a component). 
 * That’s what you get when you use export default Button and import Button from './Button'.
 * Named exports are useful for utility modules that export several functions. A module may have at most one default export and as many named exports as you like.
 * 
 * See https://stackoverflow.com/questions/36795819/when-should-i-use-curly-braces-for-es6-import/36796281#36796281
 */


export default class CSISHelpers {
  /**
    * Drupal JSON API 'deeply' inlcudes objects, e.g. &include=field_references are provided onyl once in a separate array name 'inlcuded'.
    * This method resolves the references and extracts the included  object.
    * 
    * @param {string} type 
    * @param {number} id 
    * @param {boolean} includedArray 
   */
  static getIncludedObject(type, id, includedArray) {
    if (type != null && id != null) {
      for (let i = 0; i < includedArray.length; ++i) {
        if (includedArray[i].type === type && includedArray[i].id === id) {
          return includedArray[i];
        }
      }
    }

    return null;
  }

  /**
   * 
   * @param {Object} studyGroupNode 
   * @returns {Wkt}
   */
  static extractStudyAreaFromStudyGroupNode(studyGroupNode) {
    let studyArea = new Wkt.Wkt();

    if (studyGroupNode.attributes.field_area != null && studyGroupNode.attributes.field_area.value != null) {
      studyArea.read(studyGroupNode.attributes.field_area.value);
    } else {
      console.warn('no study area in study ' + studyGroupNode);
    }

    const studyAreaJson = studyArea.toJson();
    return studyAreaJson;
  }

  static sum(a, b) {
    return a + b;
  }
}

/**
 * We can either use "import CSISHelpers from './CSISHelpers.js'" and call  "CSISHelpers.getIncludedObject(...)" or
 * "import {getIncludedObject} from './CSISHelpers.js'" and call "getIncludedObject(...)" or
 */

export const getIncludedObject = CSISHelpers.getIncludedObject;
export const sum = CSISHelpers.sum;