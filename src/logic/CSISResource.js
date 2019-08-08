
/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

 import {extractTagsfromResource} from './CSISHelpers.js'

/**
 * Experimental CSIS Resopurce Class
 * 
 * @author [Pascal Dihé](https://github.com/p-a-s-c-a-l)
 */
export default class CSISResource {

    /**
     * 
     * @param {Object} resource 
     * @param {Object[]} includes 
     */
    constructor(resource, includes) {
        this.resource = resource;
        this.includes = includes;
    }

   /**
    * Convenienece methos for retrieving the service type from Drupal resource JSON object
    * 
    * @return {Object}
    */
    getServiceType() {
        let serviceType = extractTagsfromResource(this.resource, this.includes, 'taxonomy_term--service_type');
        return (Array.isArray(serviceType) && serviceType.length > 0) ? serviceType[0] : null;
    }
}