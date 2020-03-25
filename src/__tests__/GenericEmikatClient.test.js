import ReactDOM from 'react-dom';
import React from 'react';

import log from 'loglevel';

import GenericEmikatClient from './../components/commons/GenericEmikatClient.js';
import GenericEmikatTable from './../components/commons/GenericEmikatTable.js';

describe('EMIKAT API tests with authentication', () => {

    // skip tests if local credentials file is not available
    if (!process.env.EMIKAT_CREDENTIALS) {
        it.only('no emikatCredentials.js fixture found, skipping remote EMIKAT API tests', () => {
            log.warn('no emikatCredentials.js fixture found, skipping remote EMIKAT API tests');
        });
    }

    it('test render GenericEmikatClient with GenericEmikatTable and remote API data Credentials', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <GenericEmikatClient
                emikatUrl={'https://service.emikat.at/EmiKatTst/api/scenarios/2846/feature/tab.CLY_EL_POPULATION_INTERPOLATED.2016/table/data?rownum=1000'}
                emikatCredentials={process.env.EMIKAT_CREDENTIALS}
                render={GenericEmikatTable}>
            </GenericEmikatClient>
            , div);
        ReactDOM.unmountComponentAtNode(div);
    });
});