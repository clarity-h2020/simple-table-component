import React from 'react';

import {EMIKATHelpers} from 'csis-helpers-js';
import GenericEmikatClient from './commons/GenericEmikatClient.js';
import ParameterSelectionComponent from './commons/ParameterSelectionComponent.js';
import GenericEmikatTable from './commons/GenericEmikatTable.js';

/**
 * The Risk and Impact Table!
 * 
 * TODO: RA/IA API URL currently hardcoded and not loaded from Data Package, see ${emikatTemplateUrl}.
 * YAGNI: Questionable if it is really worth the effort to mess with the Drupal APi and extract the URLs.
 * 
 * @param {*} props 
 * @see https://github.com/clarity-h2020/emikat/issues/9
 * @see https://csis.myclimateservice.eu/node/1356
 */
const RiskAndImpactTable = (props) => {
    return (
    <ParameterSelectionComponent
      {...props}
      emikatTemplateUrl={`https://service.emikat.at/EmiKatTst/api/scenarios/2846/feature/view.2974/table/data?rownum=1000&filter=STUDY_VARIANT%3D%27${EMIKATHelpers.STUDY_VARIANT}%27&filter=TIME_PERIOD%3D%27${EMIKATHelpers.TIME_PERIOD}%27&filter=EMISSIONS_SCENARIO%3D%27${EMIKATHelpers.EMISSIONS_SCENARIO}%27&filter=EVENT_FREQUENCY%3D%27${EMIKATHelpers.EVENT_FREQUENCY}%27&filter=SZ_ID%3D${EMIKATHelpers.EMIKAT_STUDY_ID}`}
      client={GenericEmikatClient}
      render={GenericEmikatTable}>
    </ParameterSelectionComponent>);
  };

  export default RiskAndImpactTable;