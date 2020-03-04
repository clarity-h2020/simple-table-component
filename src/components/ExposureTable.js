import React from 'react';
import log from 'loglevel';

import { EMIKATHelpers } from 'csis-helpers-js';
import GenericEmikatClient from './commons/GenericEmikatClient.js';
import ExposureEmikatTable from './commons/ExposureEmikatTable.js';
import ParameterSelectionComponent from './commons/ParameterSelectionComponent.js';

/**
 * The ExposureTable
 * 
 * TODO: ExposureTable API URL currently hardcoded and not loaded from Data Package, see ${emikatTemplateUrl}.
 * YAGNI: Questionable if it is really worth the effort to mess with the Drupal APi and extract the URLs.
 * 
 * Test with emikat_id=2846
 * 
 * @param {*} props 
 * @see https://github.com/clarity-h2020/data-package/issues/49
 * @see https://csis.myclimateservice.eu/node/754
 */
const ExposureTable = (props) => {
  log.info('creating new ExposureTable');
  const emikatTemplateUrl = `https://service.emikat.at/EmiKatTst/api/scenarios/${EMIKATHelpers.EMIKAT_STUDY_ID}/feature/tab.CLY_EL_POPULATION_INTERPOLATED.2016/table/${EMIKATHelpers.DATA_FORMAT}?rownum=100&filter=SZ_ID=${EMIKATHelpers.EMIKAT_STUDY_ID}`;

  return (
    <ParameterSelectionComponent
      {...props}
      emikatTemplateUrl={emikatTemplateUrl}
      client={GenericEmikatClient}
      render={ExposureEmikatTable}>
    </ParameterSelectionComponent>);
};

export default ExposureTable;