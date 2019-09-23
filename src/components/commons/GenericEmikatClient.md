### Remote Population Exposure Table
See [Exposure data (Population) calculated from EMIKAT:](https://github.com/clarity-h2020/csis/wiki/Services-endpoints-\(used-by-CSIS\)#exposure-data-population-calculated-from-emikat)
```js
import GenericEmikatTable from './GenericEmikatTable';
import GlobalErrorBoundary from './GlobalErrorBoundary';
import emikatCredentials from './../../__fixtures__/emikatCredentials.js';
/**
 * @type {Object[]}
 */
//var emikatCredentials = undefined;

// DOES NOT WORK: Uncaught SyntaxError: Cannot use import statement outside a module
/*import('../__fixtures__/emikatCredentials.js').then(
    ({module}) => { emikatCredentials = module.default; },
    (error) => { log.info('emikatCredentials.js is not present, skipping remote API tests'); }
);*/

<GlobalErrorBoundary>
    <GenericEmikatClient
        emikatUrl={'https://service.emikat.at/EmiKatTst/api/scenarios/2846/feature/tab.CLY_EL_POPULATION_INTERPOLATED.2016/table/data?rownum=100'}
        emikatCredentials={emikatCredentials}
        render={GenericEmikatTable}>
    </GenericEmikatClient>
</GlobalErrorBoundary>

```

### Remote Hazard Events
See [Hazard Event Lookup Service - Displace all Events typically for Study Area](https://github.com/clarity-h2020/csis/wiki/Services-endpoints-\(used-by-CSIS\)#hazard-event-lookup-service---displace-all-events-typically-for-study-area)
```js
import GenericEmikatTable from './../components/GenericEmikatTable';
import GlobalErrorBoundary from './../components/GlobalErrorBoundary';
import emikatCredentials from '../__fixtures__/emikatCredentials.js';

<GlobalErrorBoundary>
    <GenericEmikatClient
        emikatUrl={'https://service.emikat.at/EmiKatTst/api/scenarios/2846/feature/tab.CLY_HAZARD_EVENTS_STUDY.2036/table/data'}
        emikatCredentials={emikatCredentials}
        render={GenericEmikatTable}>
    </GenericEmikatClient>
</GlobalErrorBoundary>

```

### Remote Local Effects
See [Local Effects or Heatwaves - displays Mean Radiation Temperature, UTCI and Aparent Temperature for each Scenario, Time period, typical Events and for each Adaptation Project:](https://github.com/clarity-h2020/csis/wiki/Services-endpoints-\(used-by-CSIS\)#local-effects-or-heatwaves---displays-mean-radiation-temperature-utci-and-aparent-temperature-for-each-scenario-time-period-typical-events-and-for-each-adaptation-project)
```js
import GenericEmikatTable from './../components/GenericEmikatTable';
import GlobalErrorBoundary from './../components/GlobalErrorBoundary';
import emikatCredentials from '../__fixtures__/emikatCredentials.js';
<div>
    <GlobalErrorBoundary>
        <GenericEmikatClient
            emikatUrl={'https://service.emikat.at/EmiKatTst/api/scenarios/2846/feature/tab.CLY_HAZARD_EVENTS_STUDY.2036/table/data'}
            emikatCredentials={emikatCredentials}
            render={GenericEmikatTable}>
        </GenericEmikatClient>
    </GlobalErrorBoundary>
</div>

```