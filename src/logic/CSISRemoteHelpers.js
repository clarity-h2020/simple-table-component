import log from 'loglevel';
import axios from 'axios';

const csisClient = axios.create({ credentials: 'include' });

  export const getXCsrfToken = async function (csisBaseUrl = 'https://csis.myclimateservice.eu') {
    const apiResponse = await axios.get(csisBaseUrl + "/rest/session/token");
    // introduce ugly side effect:
    //csisClient.headers.post['X-CSRF-Token'] = apiResponse.data;
    return apiResponse.data;
  }

    /**
   * Gets EMIKAT Credentials from Drupal JSON API and return a headers object
   * ready to be used with axios.
   * 
   * @param {String} csisBaseUrl 
   * @return {Object}
   */
  export const getEmikatCredentialsFromCsis = async function(csisBaseUrl = 'https://csis.myclimateservice.eu') {

    try {
      const apiResponse = await axios.get(csisBaseUrl + "/jsonapi", { credentials: 'include' });
      const userResponse = await axios.get(apiResponse.data.meta.links.me.href, { credentials: 'include' });

      if(userResponse.data.data.attributes.field_basic_auth_credentials) {
        //const header = {'Authorization' : 'Basic ' + btoa(userResponse.data.data.attributes.field_basic_auth_credentials)};
        //return header;
        return 'Basic ' + btoa(userResponse.data.data.attributes.field_basic_auth_credentials);
      } else {
        log.error('no field field_basic_auth_credentials in user profile ' + userResponse.data.data.attributes.name);
        return null;
      }
    }
    catch(error) {
      console.error(`could not fetch emikat credentials from $csisBaseUrl`, error);
      return null;
    }
  }