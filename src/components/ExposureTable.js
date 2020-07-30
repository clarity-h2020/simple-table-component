import React from 'react';
import log from 'loglevel';

import { EMIKATHelpers } from 'csis-helpers-js';
import GenericEmikatClient from './commons/GenericEmikatClient.js';
import GenericEmikatTable from './commons/GenericEmikatTable.js';
import ParameterSelectionComponent from './commons/ParameterSelectionComponent.js';

/**
 * The Exposure Table
 * 
 * EMIKAT API URL is hardcoded and not loaded from Data Package since EMIKAT Resources are not updated anyway
 * and table views  do not change. See ${emikatTemplateUrl}.
 * 
 * 
 * @param {*} props 
 * @see https://github.com/clarity-h2020/data-package/issues/49
 * @see https://csis.myclimateservice.eu/node/754
 */
const ExposureTable = (props) => {
  log.info('creating new ExposureTable');
  /**
   * Combined Exposure Table View for Flood and Heat
   */
  const emikatView = 'view.2955';

  /**
   * Exposure Table View for Heat (Element at Risk = Population)
   * @deprecated
   */
  // emikatView = 'tab.CLY_EL_POPULATION_INTERPOLATED.2016'

  /**
   * Template URL. Parameters are substituted with values recivied from Drupla API.
   * **Warning:** &filter=SZ_ID=${EMIKATHelpers.EMIKAT_STUDY_ID} is required altough EMIKAT_STUDY_ID is already part of the path!
   */
  const emikatTemplateUrl = `https://service.emikat.at/EmiKatTst/api/scenarios/${EMIKATHelpers.EMIKAT_STUDY_ID}/feature/${emikatView}/table/${EMIKATHelpers.DATA_FORMAT}?rownum=${EMIKATHelpers.ROWNUM}&filter=SZ_ID=${EMIKATHelpers.EMIKAT_STUDY_ID}`;

  const columns =
		'&column=GRID_ID&column=POPULATION_TOTAL&column=ROADS_M2&column=RESIDENTIAL_BUILDINGS_M2&column=NON_RESIDENTIAL_BUILDINGS_M2';

  return (
    <ParameterSelectionComponent
      {...props}
      columns={columns}
      emikatTemplateUrl={emikatTemplateUrl}
      client={GenericEmikatClient}
      render={GenericEmikatTable}>
    </ParameterSelectionComponent>);
};

export default ExposureTable;