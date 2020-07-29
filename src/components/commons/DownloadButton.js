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
import FileSaver from 'file-saver';

/**
 * The DownloadButton is a component similar to the `GenericEmikatClient`, except that it provides a UI for selecting the format of the data retrieved rom EMIKAT API and forces the browser to download the data.
 * While specialised tables like the [](Exposure Table)
 * 
 * @param {*} param0 
 */
const DownloadButton = ({ emikatTemplateUrl, emikatParameters, emikatCredentials }) => {

  log.info('creating new DownloadButton');

  const [state, setState] = useState({ ...emikatParameters });

  // needed to force a re-render when props change (from outside) OMG!
  // See https://stackoverflow.com/questions/54865764/react-usestate-does-not-reload-state-from-props#comment96502928_54866051
  useEffect(() => {
    setState((state) => ({ ...state, ...emikatParameters, buttonDisabled: false }))
  }, [emikatParameters]);

  function handleChange(event) {
    console.debug(`changing data format to ${event.target.name} = ${event.target.value}`);
    const tmpState = { ...state, [event.target.name]: event.target.value };
    setState(tmpState);
  }

  function handleClick(event) {
    // See https://medium.com/better-programming/handling-multiple-form-inputs-in-react-c5eb83755d15
    console.debug(`downloading data in format ${state.dataFormat}`);
    const emikatUrl = parametriseEmikatTemplateUrl(emikatTemplateUrl, state);

    //setState(updatedEmikatParameters);

    const fetchData = async () => {
      try {
        setState((state) => ({ ...state, buttonDisabled: true }));
        // yes, here we use fetch because axios doe not support response.blob()
        const response = await fetch(emikatUrl, { headers: { Authorization: emikatCredentials } });

        if (!response.ok) {
          throw new Error('Network response was not ok.', response);
        }

        const blob = await response.blob();
        // TODO: constuct individual file name instead of 'data'.
        const fileName = 'data.' + (state.dataFormat === 'data' ? 'json' : state.dataFormat);

        log.debug(`saving data as ${fileName}`);
        FileSaver.saveAs(blob, fileName);
        setState((state) => ({ ...state, buttonDisabled: false }));

      } catch (error) {
        log.error('error caught in fetchData', error);
        setState((state) => ({ ...state, buttonDisabled: false }));
      }
    };

    fetchData();
  }

  function parametriseEmikatTemplateUrl(emikatTemplateUrl, parameters) {
    const parametersMap = new Map(
      [[EMIKATHelpers.EMIKAT_STUDY_ID, parameters.emikatStudyId],
      [EMIKATHelpers.ROWNUM, 25000],
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
      <div>
        <label htmlFor="dataFormat"> Data Format: </label>
        <select id="dataFormat" name="dataFormat" onChange={handleChange} value={state.dataFormat}>
          <option value={EMIKATHelpers.DATA_FORMAT_VALUES[0]}>JSON</option>
          <option value={EMIKATHelpers.DATA_FORMAT_VALUES[1]}>CSV</option>
          <option value={EMIKATHelpers.DATA_FORMAT_VALUES[2]}>GeoJSON</option>
        </select>&nbsp;&nbsp;
        <button id="download" name="download" disabled={state.buttonDisabled} onClick={handleClick}>{state.buttonDisabled ? 'Downloading ...' : 'Download'}</button>
      </div>);
  } else {
    // works but with warning: Failed prop type: The prop `emikatCredentials` is marked as required in `ParameterSelectionComponent`, but its value is `null`.
    return <div>Loading...</div>;
  }
}

// ARGH: Circular import does not work:
//DownloadButton.propTypes = ParameterSelectionComponent.propTypes;
//DownloadButton.defaultProps = ParameterSelectionComponent.defaultProps;

export default DownloadButton;