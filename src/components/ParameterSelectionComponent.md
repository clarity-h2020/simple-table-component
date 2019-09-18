### Remote Population Exposure Table
See [Exposure data (Population) calculated from EMIKAT:](https://github.com/clarity-h2020/csis/wiki/Services-endpoints-\(used-by-CSIS\)#exposure-data-population-calculated-from-emikat)
```js
import GenericEmikatTable from './../components/GenericEmikatTable';
import GenericEmikatClient from './../components/GenericEmikatClient';
import GlobalErrorBoundary from './../components/GlobalErrorBoundary';
import emikatCredentials from '../__fixtures__/emikatCredentials.js';
import { EMIKATHelpers } from 'csis-helpers-js';

<GlobalErrorBoundary>
    
    <ParameterSelectionComponent
        emikatTemplateUrl={`https://service.emikat.at/EmiKatTst/api/scenarios/2846/feature/tab.CLY_EL_POPULATION_INTERPOLATED.2016/table/data?rownum=100&EMISSION_SCENARIO=${EMIKATHelpers.EMISSIONS_SCENARIO}&TIME_PERIOD=${EMIKATHelpers.TIME_PERIOD}&EVENT_FREQUENCY=${EMIKATHelpers.EVENT_FREQUENCY}&STUDY_ID=${EMIKATHelpers.EMIKAT_STUDY_ID}`}
        emikatParameters={{
            emikatStudyId: 2846,
            timePeriod: EMIKATHelpers.TIME_PERIOD_VALUES[0],
            emissionScenario: EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0],
            eventFrequency: EMIKATHelpers.EVENT_FREQUENCY_VALUES[0]
            }}
        emikatCredentials={emikatCredentials}
        client={GenericEmikatClient}
        render={GenericEmikatTable}>
    </ParameterSelectionComponent>
</GlobalErrorBoundary>

```