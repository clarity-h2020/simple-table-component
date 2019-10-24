/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

import React, { useState, useEffect } from 'react';
import log from 'loglevel';
import { EMIKATHelpers } from 'csis-helpers-js';

const DownloadButton = ({ emikatTemplateUrl, emikatParameters, emikatCredentials }) => {

  log.info('creating new DownloadButton');

  const [state, setState] = useState({ ...emikatParameters });

  // needed to force a re-render when props change (from outside) OMG!
  // See https://stackoverflow.com/questions/54865764/react-usestate-does-not-reload-state-from-props#comment96502928_54866051
  useEffect(() => {
    log.error(emikatParameters);
    setState((state) => ({ ...state, ...emikatParameters}))
  }, [emikatParameters]);

  function handleChange(event) {
    // See https://medium.com/better-programming/handling-multiple-form-inputs-in-react-c5eb83755d15
    const tmpState = { ...state, [event.target.name]: event.target.value };
    setState(tmpState);
  }

  function parametriseEmikatTemplateUrl(emikatTemplateUrl, parameters) {
    const parametersMap = new Map(
      [[EMIKATHelpers.EMIKAT_STUDY_ID, parameters.emikatStudyId],
      [EMIKATHelpers.DATA_FORMAT, parameters.dataFormat],
      [EMIKATHelpers.STUDY_VARIANT, parameters.studyVariant],
      [EMIKATHelpers.TIME_PERIOD, parameters.timePeriod],
      [EMIKATHelpers.EMISSIONS_SCENARIO, parameters.emissionsScenario],
      [EMIKATHelpers.EVENT_FREQUENCY, parameters.eventFrequency]]
    );
    return EMIKATHelpers.addEmikatParameters(emikatTemplateUrl, parametersMap);
  }

  if (emikatTemplateUrl && emikatCredentials && emikatCredentials !== undefined && emikatCredentials !== null) {
      return (
        <a download rel="noopener noreferrer" target="_blank" href={parametriseEmikatTemplateUrl(emikatTemplateUrl, state)}>{parametriseEmikatTemplateUrl(emikatTemplateUrl, state)}</a>);

  } else {
    // works but with warning: Failed prop type: The prop `emikatCredentials` is marked as required in `ParameterSelectionComponent`, but its value is `null`.
    return <div>Loading...</div>;
  }
}

// ARGH: Circular import does not work:
//DownloadButton.propTypes = ParameterSelectionComponent.propTypes;
//DownloadButton.defaultProps = ParameterSelectionComponent.defaultProps;

export default DownloadButton;