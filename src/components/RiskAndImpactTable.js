import React from 'react';
import log from 'loglevel';

import { EMIKATHelpers } from 'csis-helpers-js';
import GenericEmikatClient from './commons/GenericEmikatClient.js';
import ParameterSelectionComponent from './commons/ParameterSelectionComponent.js';
import GenericEmikatTable from './commons/GenericEmikatTable.js';

/**
 * The Risk and Impact Table!
 * 
 * EMIKAT API URL is hardcoded and not loaded from Data Package since EMIKAT Resources are not updated anyway
 * and table views  do not change. See ${emikatTemplateUrl}.
 * 
 * @param {*} props 
 * @see https://github.com/clarity-h2020/emikat/issues/9
 * @see https://csis.myclimateservice.eu/node/1356
 */
const RiskAndImpactTable = (props) => {
  log.info('creating new RiskAndImpactTable');
  /**
	 * Combined Table View for Flood and Heat
	 */
  const emikatView = 'view.3155'; // old: view.2975
  
  const emikatTemplateUrl = `https://service.emikat.at/EmiKatTst/api/scenarios/${EMIKATHelpers.EMIKAT_STUDY_ID}/feature/${emikatView}/table/${EMIKATHelpers.DATA_FORMAT}?rownum=${EMIKATHelpers.ROWNUM}&filter=SZ_ID=${EMIKATHelpers.EMIKAT_STUDY_ID}&filter=STUDY_VARIANT%3D%27BASELINE%27&filter=TIME_PERIOD%3D%27${EMIKATHelpers.TIME_PERIOD}%27&filter=EMISSIONS_SCENARIO%3D%27${EMIKATHelpers.EMISSIONS_SCENARIO}%27&filter=EVENT_FREQUENCY%3D%27${EMIKATHelpers.EVENT_FREQUENCY}%27`;

  // see comment in HazardLocalEffectsTable why we define the columns here
  const columns =
    '&column=GRID_ID&column=HW_EXPOSEDQUANTITY&column=HW_DAMAGEPROBABILITY&column=HW_DAMAGEQUANTITY&column=HW_DISCOMFORT_LEVEL&column=HW_POPULATION_DENSITY_CLASS&column=HW_HEAT_WAVE_IMPACT&column=PF_RESIDENTIAL_BUILDINGS&column=PF_NON_RESIDENTIAL_BUILDINGS&column=PF_ROADS_M2&column=PF_DAMAGEPROBABILITY&column=PF_DAMAGE_CLASS&column=PF_FLOOD_IMPACT_EURO';

  /**
	 * Custom formatting of column data.
	 */
  const resolveData = function (data) {
    data.map(function transform(row) {
      var index = 2; // HW_DAMAGEPROBABILITY
      row.values[index] = row.values[index] !== null && !isNaN(parseFloat(row.values[index])) ?
        Math.round(row.values[index] * 100000 + Number.EPSILON) / 100000 : 'n/a';

      index = 3; // HW_DAMAGEQUANTITY
        row.values[index] = row.values[index] !== null && !isNaN(parseFloat(row.values[index])) ?
          Math.round(row.values[index] * 100 + Number.EPSILON) / 100 : 'n/a';

      index = 7; // PF_RESIDENTIAL_BUILDINGS
      row.values[index] = row.values[index] !== null && !isNaN(parseFloat(row.values[index])) ?
        Math.round(row.values[index]) : 'n/a';

      index = 8; // PF_NON_RESIDENTIAL_BUILDINGS
      row.values[index] = row.values[index] !== null && !isNaN(parseFloat(row.values[index])) ?
        Math.round(row.values[index]) : 'n/a';

      index = 9; // PF_ROADS_M2
      row.values[index] = row.values[index] !== null && !isNaN(parseFloat(row.values[index])) ?
        Math.round(row.values[index]) : 'n/a';

      index = 12; // PF_FLOOD_IMPACT_EURO
      row.values[index] = row.values[index] !== null && !isNaN(parseFloat(row.values[index])) ?
        Math.round(row.values[index]) + ' €' : 'n/a';

      return row;
    });

    return data;
  };

  return (
    <ParameterSelectionComponent
      {...props}
      emikatTemplateUrl={emikatTemplateUrl}
      columns={columns}
      client={GenericEmikatClient}
      render={GenericEmikatTable}
      props={{ resolveData: resolveData }}>
    </ParameterSelectionComponent>);
};

export default RiskAndImpactTable;