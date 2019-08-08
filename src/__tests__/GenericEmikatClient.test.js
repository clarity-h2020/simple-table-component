import ReactDOM from 'react-dom';
import React from 'react';

import log from 'loglevel';

import GenericEmikatClient from '../components/GenericEmikatClient.js';
import GenericEmikatTable from './../components/GenericEmikatTable';

/**
 * @type {String}
 */
import emikatCredentials from '../__fixtures__/emikatCredentials.js';


describe('EMIKAT API tests with authentication', () => {

    // skip tests if local credentials file is not available
    if (!emikatCredentials || emikatCredentials === undefined) {
        it.only('no emikatCredentials.js fixture found, skipping remote EMIKAT API tests', () => {
            log.warn('no emikatCredentials.js fixture found, skipping remote EMIKAT API tests');
        });
    }

    it('test render GenericEmikatClient with GenericEmikatTable and remote API data Credentials', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <GenericEmikatClient
                emikatUrl={'https://service.emikat.at/EmiKatTst/api/scenarios/2846/feature/tab.CLY_EL_POPULATION_INTERPOLATED.2016/table/data?rownum=100'}
                emikatCredentials={emikatCredentials}
                render={GenericEmikatTable}>
            </GenericEmikatClient>
            , div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
