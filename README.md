Simple Table Component [![Build Status](https://ci.cismet.de/buildStatus/icon?job=simple-table-component)](https://ci.cismet.de/view/CLARITY/job/simple-table-component/)
===========================

## Description

The **Simple** Table Component visualise tabular data directly received from [EMIKAT API](https://service.emikat.at/EmiKatTst/swagger/index.html). It visualises the data “as-is”, which means, it does not perform any aggregation in contrast to the now deprecated [Table Component](https://github.com/clarity-h2020/table-components) which used to access the now deprecated [table-state-rest-api](https://github.com/clarity-h2020/table-state-rest-api).
 
## Implementation 

Specialised tables for EU-GL Steps EE, HC, HC-LE, RA/IA and AAOP are implemented as separate components. The main components are:

### GenericEmikatClient

A Generic EMIKAT Client that communicates with the [EMIKAT API](https://service.emikat.at/EmiKat/swagger/index.html) and accepts as *render prop* an arbitrary JSX Component that is able to understand the EMIKAT Data Format and visualises the data retrieved by the client component, e.g. the `<GenericEmikatTable>`. It accepts furthermore `emikatParameters` props which control how the EMIKAT *template URL* is parameterised. 

Example *template URL* and the *parameterised URL* for Hazard with Local Effects for study with id `3189`: 

- `https://service.emikat.at/EmiKatTst/api/scenarios/${EMIKATHelpers.EMIKAT_STUDY_ID}/feature/${emikatView}/table/data?rownum=${EMIKATHelpers.ROWNUM}&filter=SZ_ID=${EMIKATHelpers.EMIKAT_STUDY_ID}`
- https://service.emikat.at/EmiKatTst/api/scenarios/3189/feature/view.2974/table/data?rownum=1000&filter=SZ_ID=3189

The related *response* (excerpt):

```JSON
{
  "name": "MAP Local Effects- Mean, UTCI and Apperent Temperature, Discomfort level",
  "description": "Display of Mean, UTCI and Apperent Temperature and Discomfort level for different Scenarios",
  "columnnames": [
    "GRID_ID",
    "MULTIPOLYGON",
    "STUDY_VARIANT",
    "TIME_PERIOD",
    "EMISSIONS_SCENARIO",
    "EVENT_FREQUENCY",
    "T_MRT",
    "T_UTCI",
    "T_A",
    "DISCOMFORT_LEVEL",
    "SZM_SZENARIO_REF"
  ],
  "rows": [
    {
      "rownum": 0,
      "values": [
        "500mE55225N17605",
        "POLYGON ((5522500 1760500, 5523000 1760500, 5523000 1761000, 5522500 1761000, 5522500 1760500))",
        "BASELINE",
        "20110101-20401231",
        "rcp26",
        "Rare",
        69.03435672650336,
        54.30440831904718,
        37.40195635643778,
        5,
        3189
      ]
    },
```

### Download Button
The DownloadButton is a component similar to the `GenericEmikatClient`, except that it provides an UI for selecting the format of the data retrieved from EMIKAT API and forces the browser to download the data instead of forwarding it to a separate render component.

### GenericEmikatTable
A Generic Table Component based on [ReactTable](https://www.npmjs.com/package/react-table) v6.0 that understand the 'special' JSON format of the [EMIKAT API](https://service.emikat.at/EmiKat/swagger/index.html). It uses [csis-helpers-js](https://github.com/clarity-h2020/csis-helpers-js/) to translate the proprietary EMIKAT JSON format into a tabular format understood by ReactTable. It is the 'base class' of more specific tables like the `ExposureTable`. Specific tables can provide their own `generateColumns` and `resolveData` functions as props that control which columns are shown and how the data is formatted. Tables don't care where the data comes from, they accept a `data` prop which has to contain a JSON Object following the EMIKAT API format.

### Parameter Selection Component

The Parameter Selection Component can wrap an `EmikatClientComponen`t` and a `DownloadButton` Component as *render props* and add a user interface for selection parameters related to a *scenario*. in particular `time_period`, `emissions_scenario` and `event_frequency`. The Parameter Selection Component thereby changes the respective `emikatParameters` props of the wrapped components. These props are used to parameterise the API template URL.

### Specialised Tables

Specialised Tables that implement some custom formatting of row values and custom selection of columns (not all of them are interesting for end users) are: 


### Exposure Table

## Tests

The same Unit Tests as for [csis-helpers-js](https://github.com/clarity-h2020/csis-helpers-js/#tests) are performed. UI Integration Tests are implemented with help of [cypress.io](https://www.cypress.io/) in repository [csis-technical-validation](https://github.com/clarity-h2020/csis-technical-validation).

Apart from that, the different table components can be manually tested locally with `yarn start`. Although they are served from localhost, the user must be logged-in in either [csis](https://csis.myclimateservice.eu/) or [csis-dev](https://csis-dev.myclimateservice.eu/).  

Example URL for testing HazardLocalEffectsTable locally against study `3183` and Baseline Scenario:

`http://localhost:3000/HazardLocalEffectsTable/?host=https://csis-dev.myclimateservice.eu&study_uuid=9359e741-df40-4bcd-9faf-2093b499c65c&study_area=POLYGON%20((16.346111%2048.223997,%2016.346111%2048.238634,%2016.376667%2048.238634,%2016.376667%2048.223997,%2016.346111%2048.223997))&emikat_id=3183&datapackage_uuid=2434ce93-93d4-4ca2-8618-a2de768d3f16&time_period=Baseline&emissions_scenario=Baseline&event_frequency=Rare`


## Usage

Unless the the [Scenario Analysis Component](https://github.com/clarity-h2020/scenario-analysis), this component does not use [seamless.js](https://github.com/travist/seamless.js/) to communicate with the [CSIS Drupal System](https://csis.myclimateservice.eu/) when embedded as iFrame. Instead, it can be configured by query parameters. Main reasons are that bidirectional communication between iFrame and main site are not required and that query parameters allow the app to be tested indepedently of the 

They can be selected by by the respctive route, e.g. 

query parameters are translated in to props.

For more information refer to [GenericEmikatClient.propTypes](https://github.com/clarity-h2020/simple-table-component/blob/dev/src/components/commons/GenericEmikatClient.js#L97), [ParameterSelectionComponent.propTypes](https://github.com/clarity-h2020/simple-table-component/blob/dev/src/components/commons/ParameterSelectionComponent.js#L158) and 