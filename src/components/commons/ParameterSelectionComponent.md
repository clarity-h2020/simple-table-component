### Remote Population Exposure Table
See [Exposure data (Population) calculated from EMIKAT:](https://github.com/clarity-h2020/csis/wiki/Services-endpoints-\(used-by-CSIS\)#exposure-data-population-calculated-from-emikat)
```js
import GenericEmikatTable from './GenericEmikatTable';
import GenericEmikatClient from './GenericEmikatClient';
import GlobalErrorBoundary from './GlobalErrorBoundary';
import emikatCredentials from './../../__fixtures__/emikatCredentials.js';
import { EMIKATHelpers } from 'csis-helpers-js';

<GlobalErrorBoundary>
    
    <ParameterSelectionComponent
        emikatTemplateUrl={`https://service.emikat.at/EmiKatTst/api/scenarios/2846/feature/view.2974/table/data?rownum=100&filter=STUDY_VARIANT%3D%27BASELINE%27&filter=TIME_PERIOD%3D%27${EMIKATHelpers.TIME_PERIOD}%27&filter=EMISSIONS_SCENARIO%3D%27${EMIKATHelpers.EMISSIONS_SCENARIO}%27&filter=EVENT_FREQUENCY%3D%27${EMIKATHelpers.EVENT_FREQUENCY}%27`}
        emikatParameters={{
            emikatStudyId: 2846,
            dataFormat: EMIKATHelpers.DSTA_FORMAT_VALUES[0],
            timePeriod: EMIKATHelpers.TIME_PERIOD_VALUES[0],
            emissionScenario: EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0],
            eventFrequency: EMIKATHelpers.EVENT_FREQUENCY_VALUES[0],
            }}
        emikatCredentials={emikatCredentials}
        client={GenericEmikatClient}
        render={GenericEmikatTable}>
    </ParameterSelectionComponent>
</GlobalErrorBoundary>

```