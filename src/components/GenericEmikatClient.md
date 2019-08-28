### Remote Population Exposure Table
```js
import GenericEmikatTable from './../components/GenericEmikatTable';
import GlobalErrorBoundary from './../components/GlobalErrorBoundary';
/**
 * @type {Object[]}
 */
var emikatCredentials = undefined;

import('../__fixtures__/emikatCredentials.js').then(
    ({module}) => { emikatCredentials = module.default; },
    (error) => { log.info('emikatCredentials.js is not present, skipping remote API tests'); }
);

<GlobalErrorBoundary>
    <GenericEmikatClient
        emikatUrl={'https://service.emikat.at/EmiKatTst/api/scenarios/2846/feature/tab.CLY_EL_POPULATION_INTERPOLATED.2016/table/data?rownum=100'}
        emikatCredentials={emikatCredentials}
        render={GenericEmikatTable}>
    </GenericEmikatClient>
</GlobalErrorBoundary>

```