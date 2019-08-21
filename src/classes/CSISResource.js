
/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

 import {CSISHelpers} from 'csis-helpers-js';

/**
 * Experimental CSIS Resource Class
 * 
 * @author [Pascal Dihé](https://github.com/p-a-s-c-a-l)
 * @class
 */
export default class CSISResource {

    /**
     * 
     * @param {Object} resource 
     * @param {Object[]} includes 
     * @constructor
     */
    constructor(resource, includes) {
        this.resource = resource;
        this.includes = includes;
    }

   /**
    * Convenience method for retrieving the service type from Drupal resource JSON object
    * 
    * @return {Object}
    * @returns {String}
    */
    getServiceType() {
        const serviceType = this.getTags('taxonomy_term--service_type');
        return (Array.isArray(serviceType) && serviceType.length > 0) ? serviceType[0] : null;
    }

    /**
     * 
     * @param {String} referenceType 
     * @returns {Object{[]}
     */
    getReferences(referenceType) {
        return CSISHelpers.extractReferencesfromResource(this.resource, this.includes, referenceType);
    }

    /**
     * 
     * @param {String} tagType 
     * @returns {Object{[]}
     */
    getTags(tagType) {
        return CSISHelpers.extractTagsfromResource(this.resource, this.includes, tagType);
    }


}