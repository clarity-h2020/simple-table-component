/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
//import log from 'loglevel';
import GenericEmikatClient from './GenericEmikatClient.js';
import GenericEmikatTable from './GenericEmikatClient.js';
import { EMIKATHelpers } from 'csis-helpers-js';
import log from 'loglevel';


const ParameterSelectionComponent = ({ emikatTemplateUrl, emikatParameters, emikatCredentials, client: EmikatClientComponent, render: EmikatVisualisationComponent }) => {
  /**
   *  1) Either we pass just `props` and access `props.render` or
   *  we need to add `render` to the **destructuring assignment** of the argument `props`.
   *  2) We rename `render` to `EmikatClientComponent` using ES6 destructuring assignment syntax, because **components** must be capitalized in React.
   *  3) Instead of using a function to render dynamic children ("render props"), we use standard JSX composition in props! See https://americanexpress.io/faccs-are-an-antipattern/
   */

  // useState returns an array with 2 elements, and we’re using **ES6 destructuring** to assign names to them
  /**
   * You might be wondering: why is useState not named createState instead?
   * “Create” wouldn’t be quite accurate because the state is only created the first time our component renders. 
   * During the next renders, useState gives us the current state. Otherwise it wouldn’t be “state” at all! 
   * There’s also a reason why Hook names always start with use. 
   */
  // You can think of effects as a combination of componentDidMount() and componentDidUpdate() of class-based components.
  // In this case, I want it to run just once, so I pass both a function and an empty array. 
  // The array argument tells the Hook to apply the effect (i.e., run the function) only if the state variables listed in the array are changed.
  const [state, setState] = useState({ ...emikatParameters});
  const [emikatUrl, setEmikatUrl] = useState(parametriseEmikatTemplateUrl(emikatTemplateUrl, emikatParameters));

  function handleChange(event) {
    // See https://medium.com/better-programming/handling-multiple-form-inputs-in-react-c5eb83755d15
    const tmpState = { ...state, [event.target.name]: event.target.value };
    log.debug(tmpState);

    // don't allow the user to select time period baseline when emission scenario is not baseline
    if (event.target.name === 'timePeriod' && event.target.value === EMIKATHelpers.TIME_PERIOD_VALUES[0]) {
      tmpState.emissionsScenario = EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0];
    }

    if (event.target.name === 'timePeriod' && event.target.value !== EMIKATHelpers.TIME_PERIOD_VALUES[0] 
    && tmpState.emissionsScenario === EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0]){
      tmpState.emissionsScenario = EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[1];
    }

    // if user selects
    if (event.target.name === 'emissionsScenario' && event.target.value === EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0]){
      tmpState.timePeriod = EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0];
    }

    if (event.target.name === 'emissionsScenario' && event.target.value !== EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0] 
    && tmpState.timePeriod === EMIKATHelpers.TIME_PERIOD_VALUES[0]){
      tmpState.timePeriod = EMIKATHelpers.TIME_PERIOD_VALUES[1];
    }

    setState(tmpState);
    setEmikatUrl(parametriseEmikatTemplateUrl(emikatTemplateUrl, tmpState));
  }

  function parametriseEmikatTemplateUrl(emikatTemplateUrl, parameters) {
    const parametersMap = new Map(
      [[EMIKATHelpers.EMIKAT_STUDY_ID, parameters.emikatStudyId],
      [EMIKATHelpers.STUDY_VARIANT, parameters.studyVariant],
      [EMIKATHelpers.TIME_PERIOD, parameters.timePeriod],
      [EMIKATHelpers.EMISSIONS_SCENARIO, parameters.emissionsScenario],
      [EMIKATHelpers.EVENT_FREQUENCY, parameters.eventFrequency]]
    );
    return EMIKATHelpers.addEmikatParameters(emikatTemplateUrl, parametersMap);
  }

  if (emikatUrl && emikatCredentials && EmikatVisualisationComponent && emikatCredentials !== undefined && emikatCredentials !== null) {
    return (
      <>
        <div>
          <label htmlFor="timePeriod"> Time Period </label>
          <select id="timePeriod" name="timePeriod" onChange={handleChange} value={state.timePeriod}>
            <option value={EMIKATHelpers.TIME_PERIOD_VALUES[0]}>Baseline</option>
            <option value={EMIKATHelpers.TIME_PERIOD_VALUES[1]}>2011 - 2040</option>
            <option value={EMIKATHelpers.TIME_PERIOD_VALUES[2]}>2041 - 2070</option>
            <option value={EMIKATHelpers.TIME_PERIOD_VALUES[3]}>2071 - 2100</option>
          </select>
          <label htmlFor="emissionsScenario"> Emissions Scenario </label>
          <select id="emissionsScenario" name="emissionsScenario" onChange={handleChange} value={state.emissionsScenario}>
            <option value={EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0]}>Baseline</option>
            <option value={EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[1]}>RCP 2.6</option>
            <option value={EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[2]}>RCP 4.5</option>
            <option value={EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[3]}>RCP 8.5</option>
          </select>
          <label htmlFor="eventFrequency"> Event Frequency </label>
          <select id="eventFrequency" name="eventFrequency" onChange={handleChange} value={state.eventFrequency}>
            <option value={EMIKATHelpers.EVENT_FREQUENCY_VALUES[0]}>{EMIKATHelpers.EVENT_FREQUENCY_VALUES[0]}</option>
            <option value={EMIKATHelpers.EVENT_FREQUENCY_VALUES[1]}>{EMIKATHelpers.EVENT_FREQUENCY_VALUES[1]}</option>
            <option value={EMIKATHelpers.EVENT_FREQUENCY_VALUES[2]}>{EMIKATHelpers.EVENT_FREQUENCY_VALUES[2]}</option>
          </select>
        </div>
        {/* 
        OK, but how does the EmikatVisualisationComponent get it's props? -> From EmikatClientComponent, not from the outside!
        Passing dynamic props from parent to children  is not as straightforward as one might imagine. See https://stackoverflow.com/a/32371612
      */}
        <EmikatClientComponent emikatUrl={emikatUrl} emikatCredentials={emikatCredentials} render={EmikatVisualisationComponent} />
      </>);
  } else {
    // wor but with warning: Failed prop type: The prop `emikatCredentials` is marked as required in `ParameterSelectionComponent`, but its value is `null`.
    return <div>Loading...</div>;
  }
}

/**
 * ParameterSelectionComponent Prop Types
 * 
 * @typedef {Object} GenericEmikatTableProps
 */
ParameterSelectionComponent.propTypes = {
  /**
   * URL of the EMIKAT Endpoint
   */
  emikatTemplateUrl: PropTypes.string.isRequired,

  /**
  * EMIKAT Parameters
  */
  emikatParameters: PropTypes.exact({
    //emikatStudyId: PropTypes.number.isRequired,
    emikatStudyId: PropTypes.string.isRequired, // yes, should be number but the effort is justed wasted if we retrieve it from query params and need to convert it to number
    studyVariant: PropTypes.string,
    timePeriod: PropTypes.oneOf(EMIKATHelpers.TIME_PERIOD_VALUES),
    emissionsScenario: PropTypes.oneOf(EMIKATHelpers.EMISSIONS_SCENARIO_VALUES),
    eventFrequency: PropTypes.oneOf(EMIKATHelpers.EVENT_FREQUENCY_VALUES),
  }).isRequired,

  /**
   * The Basic Auth crendetials
   */
  emikatCredentials: PropTypes.string.isRequired,

  /**
   * The actual visualisation component to be rendered
   */
  render: PropTypes.elementType

};

/**
 * ParameterSelectionComponent Default Props
 * @typedef {Object} GenericEmikatClientProps
 */
ParameterSelectionComponent.defaultProps = {

  emikatTemplateUrl: 'https://service.emikat.at/EmiKatTst/api/',
  emikatParameters: {
    emikatStudyId: undefined,
    studyVariant: EMIKATHelpers.STUDY_VARIANT_VALUES[0],
    timePeriod: EMIKATHelpers.TIME_PERIOD_VALUES[0],
    emissionsScenario: EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0],
    eventFrequency: EMIKATHelpers.EVENT_FREQUENCY_VALUES[0]
  },
  emikatCredentials: null,
  client: GenericEmikatClient,
  render: GenericEmikatTable
};

export default ParameterSelectionComponent