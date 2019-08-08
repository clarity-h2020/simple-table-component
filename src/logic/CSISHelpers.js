/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

import Wkt from 'wicket';
import log from 'loglevel';
import axios from 'axios';



/**
 * Be aware of the difference between default and named exports. It is a common source of mistakes.
 * We suggest that you stick to using default imports and exports when a module only exports a single thing (for example, a component). 
 * That’s what you get when you use export default Button and import Button from './Button'.
 * Named exports are useful for utility modules that export several functions. A module may have at most one default export and as many named exports as you like.
 * 
 * See https://stackoverflow.com/questions/36795819/when-should-i-use-curly-braces-for-es6-import/36796281#36796281
 */

/**
 * Helpers for cSIS API
 * 
 * @author Pascal Dihé
 */
export default class CSISHelpers {
  /**
    * Drupal JSON API 'deeply' inlcudes objects, e.g. &include=field_references are provided onyl once in a separate array name 'inlcuded'.
    * This method resolves the references and extracts the included  object.
    * 
    * @param {string} type 
    * @param {number} id 
    * @param {boolean} includedArray 
    * @see https://www.drupal.org/docs/8/modules/jsonapi/includes
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
   * Retrieves the EIMAT Study / Scenario ID from the Drupal Study
   * 
   * @param {Object} studyGroupNode 
   * @return {Number}
   */
  static extractEmikatIdFromStudyGroupNode(studyGroupNode) {
   
    let emikatId = -1;
    if (studyGroupNode.attributes.field_emikat_id !== undefined && studyGroupNode.attributes.field_emikat_id != null 
      && !isNaN(studyGroupNode.attributes.field_emikat_id)) {
      emikatId = parseInt(studyGroupNode.attributes.field_emikat_id, 10);
    } else {
      log.warn('no emikat id in study ' + studyGroupNode.attributes.field_emikat_id);
    }

    return emikatId;
  }



  /**
   * Returns the JSON representation of the study area.
   * 
   * @param {Object} studyGroupNode 
   * @returns {JSON}
   */
  static extractStudyAreaFromStudyGroupNode(studyGroupNode) {
    /**
     * @type {Wkt}
     */
    let studyArea = new Wkt.Wkt();

    if (studyGroupNode.attributes.field_area != null && studyGroupNode.attributes.field_area.value != null) {
      studyArea.read(studyGroupNode.attributes.field_area.value);
    } else {
      log.warn('no study area in study ' + studyGroupNode);
    }

    const studyAreaJson = studyArea.toJson();
    return studyAreaJson;
  }

  static sum(a, b) {
    return a + b;
  }

  /**
   * Filters resource array by tag id/name which are inlcuded in the tags array (due to Drupal API quirks).
   * 
   * @param {Object[]} resourceArray the original resource array
   * @param {Object[]} tagsArray included objects - Drupal APi style! :-/
   * @param {string} tagType The tag type, e.g. 'taxonomy_term--eu_gl'
   * @param {string} tagName The name of the tag, e.g.'eu-gl:hazard-characterization:local-effects'
   * @return {Object[]}
   * @see getIncludedObject()
   */
  static filterResourcesbyTagName(resourceArray, tagsArray, tagType, tagName) {
    /**
     * If we request exactly **one** resource, there would be a possiblity for simplification that applies to all taxonomy terms and tags: 
     * Instead of looking at `resource.relationships.field_resource_tags.data` we just have to search in `tagsArray` (inlcuded objects, respectively).
     */
    let filteredResourceArray = resourceArray.filter((resource) => {
      if (resource.relationships.field_resource_tags != null && resource.relationships.field_resource_tags.data != null
        && resource.relationships.field_resource_tags.data.length > 0) {
        return resource.relationships.field_resource_tags.data.some((tagReference) => {
          return tagReference.type === tagType ? tagsArray.some((tagObject) => {
            return (tagReference.type === tagObject.type && tagReference.id === tagObject.id && tagObject.attributes.name === tagName);
          }) : false;
        });
      } else {
        log.warn('no tags found  in resource ' + resource.id)
      }

      return false;

    });
    log.debug(filteredResourceArray.length + ' resources left after filtering ' + resourceArray.length
      + ' resources by tag type ' + tagType + ' and tag name ' + tagName);

    return filteredResourceArray;
  }

  /**
     * Filters resource array by reference type which are inlcuded in the references array (due to Drupal API quirks).
     * 
     * @param {Object[]} resourceArray the original resource array
     * @param {Object[]} referencesArray included objects - Drupal APi style! :-/
     * @param {string} referenceType The reference type, e.g. '@mapview:ogc:wms'
     * @return {Object[]}
     * @see getIncludedObject()
     */
  static filterResourcesbyReferenceType(resourceArray, referencesArray, referenceType) {
    let filteredResourceArray = resourceArray.filter((resource) => {
      if (resource.relationships.field_references != null && resource.relationships.field_references.data != null
        && resource.relationships.field_references.data.length > 0) {
        return resource.relationships.field_references.data.some((referenceReference) => {
          return referencesArray.some((referenceObject) => {
            return (referenceReference.type === referenceObject.type && referenceReference.id === referenceObject.id
              && referenceObject.attributes.field_reference_type === referenceType);
          });
        });
      } else {
        log.warn('no references found  in resource ' + resource.id)
      }

      return false;

    });
    // ES6 template string: https://eslint.org/docs/rules/no-template-curly-in-string
    log.debug(`${filteredResourceArray.length} resources left after filtering ${resourceArray.length} resources by reference type ${referenceType}`);

    return filteredResourceArray;
  }
  /**
      * Extracts references which are included in the references array (due to Drupal API quirks) from a resource
      * 
      * @param {Object} resource the original resource
      * @param {Object[]} referencesArray included objects - Drupal APi style! :-/
      * @param {string} referenceType The reference type, e.g. '@mapview:ogc:wms'
      * @return {Object[]}
      * @see getIncludedObject()
      */
  static extractReferencesfromResource(resource, referencesArray, referenceType) {
    let references = [];
    // the reference type is avialble only at the level of the `included` array
    if (resource.relationships.field_references != null && resource.relationships.field_references.data != null
      && resource.relationships.field_references.data.length > 0) {
      references = resource.relationships.field_references.data.flatMap((referenceReference) => {
        let filteredReferences = referencesArray.filter((referenceObject) => {
          return (referenceReference.type === referenceObject.type && referenceReference.id === referenceObject.id
            && referenceObject.attributes.field_reference_type === referenceType);
        });
        return filteredReferences;
      });
    }
    log.debug(`${references.length} references found in resouce for reference type ${referenceType}`);
    return references;
  }

  /**
      * Extracts tags which are included in the tags array (due to Drupal API quirks) from a resource
      * 
      * @param {Object} resource the original resource
      * @param {Object[]} tagsArray included objects - Drupal APi style! :-/
      * @param {string} tagType The tag type, e.g. '@mapview:ogc:wms'
      * @return {Object[]}
      * @see getIncludedObject()
      */
  static extractTagsfromResource(resource, tagsArray, tagType) {
    let tags = [];
    if (resource.relationships.field_resource_tags != null && resource.relationships.field_resource_tags.data != null
      && resource.relationships.field_resource_tags.data.length > 0) {
      tags = resource.relationships.field_resource_tags.data.flatMap(tagReference => {
        return tagReference.type === tagType ? tagsArray.filter(tagObject => tagReference.type === tagObject.type && tagReference.id === tagObject.id) : [];
      });
    }
    log.debug(`${tags.length} tags found in resouce for tag type ${tagType}`);
    return tags;
  }
}




/**
 * We can either use "import CSISHelpers from './CSISHelpers.js'" and call  "CSISHelpers.getIncludedObject(...)" or
 * "import {getIncludedObject} from './CSISHelpers.js'" and call "getIncludedObject(...)".
 * 
 * However, It is not recommended to mix default exports with “named” exports. 
 * See https://www.kaplankomputing.com/blog/tutorials/javascript/understanding-imports-exports-es6/
 */

export const getXCsrfToken = CSISHelpers.getXCsrfToken
export const extractEmikatIdFromStudyGroupNode = CSISHelpers.extractEmikatIdFromStudyGroupNode
export const getEmikatCredentialsFromCsis = CSISHelpers.getEmikatCredentialsFromCsis;
export const getIncludedObject = CSISHelpers.getIncludedObject;
export const filterResourcesbyTagName = CSISHelpers.filterResourcesbyTagName;
export const filterResourcesbyReferenceType = CSISHelpers.filterResourcesbyReferenceType;
export const extractReferencesfromResource = CSISHelpers.extractReferencesfromResource;
export const extractTagsfromResource = CSISHelpers.extractTagsfromResource;
export const sum = CSISHelpers.sum;