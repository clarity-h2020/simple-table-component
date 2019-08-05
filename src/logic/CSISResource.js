
import {extractTagsfromResource} from './CSISHelpers.js'

export default class CSISResource {

    /**
     * 
     * @param {Object} resource 
     * @param {Object[]} inlcudes 
     */
    constructor(resource, inlcudes) {
        this.resource = resource;
        this.inlcudes = inlcudes;
    }

   /**
    * @return {Object}
    */
    getServiceType() {
        let serviceType = extractTagsfromResource(this.resource, this.inlcudes, 'taxonomy_term--service_type');
        return (Array.isArray(serviceType) && serviceType.length > 0) ? serviceType[0] : null;
    }
}