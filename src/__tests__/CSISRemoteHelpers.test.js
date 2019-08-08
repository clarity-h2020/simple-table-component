import axios from 'axios';
import log from 'loglevel';

import * as CSISRemoteHelpers from './../logic/CSISRemoteHelpers.js';

/**
 * @type {Object[]}
 */
import headers from '../__fixtures__/csisHeaders.js';

let debugLogInterceptor;

beforeAll(async (done) => {

    //axios.defaults.withCredentials = true;
    if (headers && Array.isArray(headers)) {
        headers.forEach((header)=>{
            // this will fail when a new instance of axios has been created in CSISRemoteHelpers
            // because the instace is created with the *previous* defaults! :o
            //axios.defaults.headers.common[header[0]] = header[1];

            // therefore we change the instance in CSISRemoteHelpers :o
            CSISRemoteHelpers.csisClient.defaults.headers.common[header[0]] = header[1];
        });
    }
    debugLogInterceptor = CSISRemoteHelpers.csisClient.interceptors.request.use((request) => {
        log.debug(JSON.stringify(request));
        return request;
    });
    done();
});

beforeEach(async (done) => {
    // after 1st login / set cookie, the token is fixed, otherwise different for each call
    const xCsrfToken = await CSISRemoteHelpers.getXCsrfToken();
    CSISRemoteHelpers.csisClient.defaults.headers.common[axios.defaults.xsrfHeaderName] = xCsrfToken;
    done();
});

afterAll(() => {
    //delete axios.defaults.withCredentials;
    delete CSISRemoteHelpers.csisClient.defaults.headers.common[axios.defaults.xsrfHeaderName];
    if (headers) {
        delete CSISRemoteHelpers.csisClient.defaults.headers.common[headers[0]];
    }
    CSISRemoteHelpers.csisClient.interceptors.request.eject(debugLogInterceptor);
});

test('get and compare X-CSRF Token', async (done) => {
    expect.assertions(1);
    const token1 = await CSISRemoteHelpers.getXCsrfToken();
    const token2 = await CSISRemoteHelpers.getXCsrfToken();
    // if not logged in by session cookie, token will be different for each request
    if(!headers) {
        expect(token1).not.toEqual(token2);
    } else {
        expect(token1).toEqual(token2);
    }
    
    done();
});

describe('Remote API tests with authentication', () => {

    // skip tests if local headers file containing session cookie is not available
    if (!headers) {
        it.only('no headers.js fixture found, skipping remote API tests', () => {
            log.warn('no headers.js fixture found, skipping remote API tests');
        });
    }

    it('test get EIMIKAT Credentials', async (done) => {
        const emikatCredentials = await CSISRemoteHelpers.getEmikatCredentialsFromCsis();
        log.debug(emikatCredentials);
        expect.assertions(2);
        expect(emikatCredentials).toBeDefined();
        expect(emikatCredentials).not.toBeNull();
        done();
    });
});
