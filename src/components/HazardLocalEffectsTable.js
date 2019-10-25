import React from 'react';
import log from 'loglevel';

import { EMIKATHelpers } from 'csis-helpers-js';
import GenericEmikatClient from './commons/GenericEmikatClient.js';
import ParameterSelectionComponent from './commons/ParameterSelectionComponent.js';
import GenericEmikatTable from './commons/GenericEmikatTable.js';

/**
 * The HazardLocalEffect Table!
 * 
 * TODO: RA/IA API URL currently hardcoded and not loaded from Data Package, see ${emikatTemplateUrl}.
 * YAGNI: Questionable if it is really worth the effort to mess with the Drupal APi and extract the URLs.
 * 
 * Test with emikat_id=2846
 * view.2974 = HazardLocalEffects
 * 
 * @param {*} props 
 * @see https://github.com/clarity-h2020/emikat/issues/9
 * @see https://csis.myclimateservice.eu/node/1356
 */
const HazardLocalEffectsTable = (props) => {
  log.info('creating new HazardLocalEffectsTable');
  return (
    <ParameterSelectionComponent
      {...props}
      emikatTemplateUrl={`https://service.emikat.at/EmiKatTst/api/scenarios/${EMIKATHelpers.EMIKAT_STUDY_ID}/feature/view.2974/table/${EMIKATHelpers.DATA_FORMAT}?rownum=1000&filter=STUDY_VARIANT%3D%27${EMIKATHelpers.STUDY_VARIANT}%27&filter=TIME_PERIOD%3D%27${EMIKATHelpers.TIME_PERIOD}%27&filter=EMISSIONS_SCENARIO%3D%27${EMIKATHelpers.EMISSIONS_SCENARIO}%27&filter=EVENT_FREQUENCY%3D%27${EMIKATHelpers.EVENT_FREQUENCY}%27`}
      client={GenericEmikatClient}
      render={GenericEmikatTable}>
    </ParameterSelectionComponent>);
};

export default HazardLocalEffectsTable;

