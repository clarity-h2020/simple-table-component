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
//import {EMIKATHelpers} from 'csis-helpers-js';
import GenericEmikatClient from './../components/GenericEmikatClient';
import GenericEmikatTable from './../components/GenericEmikatClient';
import { EMIKATHelpers } from 'csis-helpers-js';
import log from 'loglevel';


const ParameterSelectionComponent = ({ emikatTemplateUrl, emikatParameters, emikatCredentials, client: EmikatClientComponent, render: EmikatVisualisationComponent }) => {
  /**
   *  1) Either we pass just `props` and access `props.render` or
   *  we need to add `render` to the **destructuring assignment** of the argument `props`.
   *  2) We rename `render` to `EmikatClientComponent` using ES6 destructuring assignment syntax, because **components** must be capitalized in React.
   *  3) Instead of using a function to render dynamic children ("render props"), we use standard JSX composition in props! See https://americanexpress.io/faccs-are-an-antipattern/
   */

  const [state, setState] = useState({ ...emikatParameters, emissionScenarioDisabled: emikatParameters.timePeriod === EMIKATHelpers.TIME_PERIOD_VALUES[0] ? true : false });
  const [emikatUrl, setEmikatUrl] = useState(parametriseEmikatTemplateUrl(emikatTemplateUrl, emikatParameters));

  function handleChange(event) {
    // See https://medium.com/better-programming/handling-multiple-form-inputs-in-react-c5eb83755d15
    const tmpState = { ...state, [event.target.name]: event.target.value };
    log.debug(tmpState);

    // set emission scenario to baseline
    if (tmpState.timePeriod === EMIKATHelpers.TIME_PERIOD_VALUES[0]) {
      tmpState.emissionScenario = EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0];
      tmpState.emissionScenarioDisabled = true;
    } else {
      tmpState.emissionScenarioDisabled = false;
    }

    setState(tmpState); 
    setEmikatUrl(parametriseEmikatTemplateUrl(emikatTemplateUrl, tmpState));
  }

  function parametriseEmikatTemplateUrl(emikatTemplateUrl, state) {
    const parametersMap = new Map(
      [[EMIKATHelpers.EMIKAT_STUDY_ID, state.emikatStudyId],
      [EMIKATHelpers.TIME_PERIOD, state.timePeriod],
      [EMIKATHelpers.EMISSIONS_SCENARIO, state.emissionScenario],
      [EMIKATHelpers.EVENT_FREQUENCY, state.eventFrequency]]
    );
    return EMIKATHelpers.addEmikatParameters(emikatTemplateUrl, parametersMap);
  }


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
        <label htmlFor="emissionScenario"> Emission Scenario </label>
        <select id="emissionScenario" name="emissionScenario" onChange={handleChange} value={state.emissionScenario} disabled={state.emissionScenarioDisabled}>
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

      <EmikatClientComponent emikatUrl={emikatUrl} emikatCredentials={emikatCredentials} render={EmikatVisualisationComponent} />
    </>
  );
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
    emikatStudyId: PropTypes.number.isRequired,
    timePeriod: PropTypes.oneOf(EMIKATHelpers.TIME_PERIOD_VALUES),
    emissionScenario: PropTypes.oneOf(EMIKATHelpers.EMISSIONS_SCENARIO_VALUES),
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
    emikatStudyId: -1,
    timePeriod: EMIKATHelpers.TIME_PERIOD_VALUES[0],
    emissionScenario: EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0],
    eventFrequency: EMIKATHelpers.EVENT_FREQUENCY_VALUES[0]
  },
  emikatCredentials: null,
  client: GenericEmikatClient,
  render: GenericEmikatTable
};

export default ParameterSelectionComponent