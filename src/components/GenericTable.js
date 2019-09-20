import React, { useState }  from 'react';
import log from 'loglevel';

import { EMIKATHelpers } from 'csis-helpers-js';
import GenericEmikatClient from './commons/GenericEmikatClient.js';
import ParameterSelectionComponent from './commons/ParameterSelectionComponent.js';
import GenericEmikatTable from './commons/GenericEmikatTable.js';

/**
 * A GenericTable
 * 
 * 
 * Test with emikat_id=2846
 * 
 * @param {*} props 
 * @see https://github.com/clarity-h2020/emikat/issues/9
 * @see https://csis.myclimateservice.eu/node/1356
 */
const GenericTable = (props) => {

  log.debug('render');
  const [emikatTemplateUrl, setEmikatTemplateUrl] = useState(`https://service.emikat.at/EmiKatTst/api/scenarios/${EMIKATHelpers.EMIKAT_STUDY_ID}/feature/view.2975/table/data?rownum=1000&filter=STUDY_VARIANT%3D%27${EMIKATHelpers.STUDY_VARIANT}%27&filter=TIME_PERIOD%3D%27${EMIKATHelpers.TIME_PERIOD}%27&filter=EMISSIONS_SCENARIO%3D%27${EMIKATHelpers.EMISSIONS_SCENARIO}%27&filter=EVENT_FREQUENCY%3D%27${EMIKATHelpers.EVENT_FREQUENCY}%27&filter=SZ_ID%3D${EMIKATHelpers.EMIKAT_STUDY_ID}`);
  const [emikatStudyId, setEmikatStudyId] = useState('2846');

  /**
   * Handles the onChange event in the url input field ...
   * @param {string} value 
   */
  function handleTemplateChange(value) {
    log.debug(value);
    setEmikatTemplateUrl(value);
  }

  function handleEmikatIdChange(value) {
    log.debug(value);
    setEmikatStudyId(value);
  }

  return (
    <>
      <label htmlFor="emikatTemplateUrl"> URL Template: </label>
      <input size="200" value={emikatTemplateUrl} onChange={e => handleTemplateChange(e.target.value)} />
      <label htmlFor="emikatStudyId"> EMIKAT ID: </label>
      <input size="8" value={emikatStudyId} onChange={e => handleEmikatIdChange(e.target.value)} />
      <ParameterSelectionComponent
        {...props}
        emikatParameters = {{...props.emikatParameters, emikatStudyId}}
        emikatTemplateUrl={emikatTemplateUrl}
        client={GenericEmikatClient}
        render={GenericEmikatTable}>
      </ParameterSelectionComponent>
    </>);
};

export default GenericTable;