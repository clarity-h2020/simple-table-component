import React from 'react';
import log from 'loglevel';

import {EMIKATHelpers} from 'csis-helpers-js';
import GenericEmikatClient from './commons/GenericEmikatClient.js';
import ParameterSelectionComponent from './commons/ParameterSelectionComponent.js';
import GenericEmikatTable from './commons/GenericEmikatTable.js';

/**
 * The Characterise Hazard Table
 * 
 * TODO: RA/IA API URL currently hardcoded and not loaded from Data Package, see ${emikatTemplateUrl}.
 * YAGNI: Questionable if it is really worth the effort to mess with the Drupal APi and extract the URLs.
 * 
 * Test with emikat_id=2846
 * 
 * @param {*} props 
 * @see https://github.com/clarity-h2020/emikat/issues/9
 * @see https://csis.myclimateservice.eu/node/1356
 */
const CharacteriseHazardTable = (props) => {
  log.info('creating new CharacteriseHazardTable');
    return (
    <ParameterSelectionComponent
      {...props}
      emikatTemplateUrl={`https://service.emikat.at/EmiKatTst/api/scenarios/${EMIKATHelpers.EMIKAT_STUDY_ID}/feature/tab.CLY_HAZARD_EVENTS_STUDY.2036/table/data?rownum=1000`}
      client={GenericEmikatClient}
      render={GenericEmikatTable}>
    </ParameterSelectionComponent>);
  };

  export default CharacteriseHazardTable;