import axios from 'axios';

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