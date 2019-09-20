import React from 'react';

import {EMIKATHelpers} from 'csis-helpers-js';
import GenericEmikatClient from './commons/GenericEmikatClient.js';
import GenericEmikatTable from './commons/GenericEmikatTable.js';

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

    const emikatTemplateUrl = `https://service.emikat.at/EmiKatTst/api/scenarios/${EMIKATHelpers.EMIKAT_STUDY_ID}/feature/tab.CLY_EL_POPULATION_INTERPOLATED.2016/table/data?rownum=1000`;
    const emikatUrl = EMIKATHelpers.addEmikatId(emikatTemplateUrl, props.emikatParameters.emikatStudyId);

    return (
      <GenericEmikatClient
      {...props}
      emikatUrl={emikatUrl}
      render={GenericEmikatTable}>
    </GenericEmikatClient>);
  };

  export default ExposureTable;