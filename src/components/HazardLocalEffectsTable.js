import React from 'react';
import log from 'loglevel';

import { EMIKATHelpers } from 'csis-helpers-js';
import GenericEmikatClient from './commons/GenericEmikatClient.js';
import ParameterSelectionComponent from './commons/ParameterSelectionComponent.js';
import GenericEmikatTable from './commons/GenericEmikatTable.js';

/**
 * The HazardLocalEffect Table!
 * 
 * EMIKAT API URL is hardcoded and not loaded from Data Package since EMIKAT Resources are not updated anyway
 * and table views  do not change. See ${emikatTemplateUrl}.
 * 
 * 
 * @param {*} props 
 * @see https://github.com/clarity-h2020/emikat/issues/9
 * @see https://csis.myclimateservice.eu/node/1356
 */
const HazardLocalEffectsTable = (props) => {
	log.info('creating new HazardLocalEffectsTable');
	/**
	 * Combined Table View for Flood and Heat
	 */
	const emikatView = 'view.3154'; // old: view.2974

	// &filter=SZ_ID=${EMIKATHelpers.EMIKAT_STUDY_ID} or not SZ_ID, that's the question :-(
	// The 2nd ${EMIKATHelpers.EMIKAT_STUDY_ID} is needed, otherwise the API return **all** rows. Yes, all rows for **all** scenarios.
	const emikatTemplateUrl = `https://service.emikat.at/EmiKatTst/api/scenarios/${EMIKATHelpers.EMIKAT_STUDY_ID}/feature/${emikatView}/table/${EMIKATHelpers.DATA_FORMAT}?rownum=${EMIKATHelpers.ROWNUM}&filter=SZ_ID=${EMIKATHelpers.EMIKAT_STUDY_ID}&filter=TIME_PERIOD%3D%27${EMIKATHelpers.TIME_PERIOD}%27&filter=EMISSIONS_SCENARIO%3D%27${EMIKATHelpers.EMISSIONS_SCENARIO}%27&filter=EVENT_FREQUENCY%3D%27${EMIKATHelpers.EVENT_FREQUENCY}%27`;
	/**
   * o.k., we could handle this columns stuff in a generic way and include it in csis-helpers-js as a *special case* of 
   * EMIKAT URI parametrization, but hey, KISS and YAGNI anyone? ATM column names are not treated as $variables anyway. 
   * 
   * Inconsistency alert: `EVENT_FREQUENCY` is called `Frequence` in EE API :-(
   * */
	const columns = 
		'&column=GRID_ID&column=STUDY_VARIANT&column=HW_T_MRT&column=HW_T_UTCI&column=HW_T_A&column=HW_DISCOMFORT_LEVEL&column=PF_STREAMS&column=PF_CL_STREAMS&columnPF_DELTA_ELEV&column=PF_CL_DELTA_ELEV&column=PF_RUN_OFF_AVERAGE&column=PF_CL_RUNOFF&column=PF_RAIN_MM&column=PF_CL_RAIN&column=PF_PROP';

	/**
	 * Custom formatting of column data.
	 */
	const resolveData = function (data) {
		data.map(function transform(row) {
			let index  = 2; // HW_T_MRT
			row.values[index] = row.values[index] !== null && !isNaN(parseFloat(row.values[index])) ?
				Math.round(row.values[index] * 100 + Number.EPSILON) / 100 + ' °C' : 'n/a';

			index  = 3; // HW_T_UTCI
			row.values[index] = (row.values[index] !== null && isNaN(parseFloat(row.values[index])) === false) ?
				(Math.round(row.values[index] * 100 + Number.EPSILON) / 100 + ' °C') : 'n/a';

			index  = 4; // HW_T_A
			row.values[index] = row.values[index] !== null && !isNaN(parseFloat(row.values[index])) ?
				Math.round(row.values[index] * 100 + Number.EPSILON) / 100 + ' °C' : 'n/a';

			index  = 9; // PF_RUN_OFF_AVERAGE
			row.values[index] = row.values[index] !== null && !isNaN(parseFloat(row.values[index])) ?
				Math.round(row.values[index] * 10000 + Number.EPSILON) / 10000 : 'n/a';

			return row;
		});

		return data;
	};
 
	return (
		<>
			<p>The table lists mean-, UTCI (Universal Thermal Climate Index)- and Apperent Temperature and Discomfort level for the selected RCP Scenario.</p>
			<ParameterSelectionComponent
				{...props}
				emikatTemplateUrl={emikatTemplateUrl}
				columns={columns}
				client={GenericEmikatClient}
				render={GenericEmikatTable}
				props={{ resolveData: resolveData }}>
			</ParameterSelectionComponent>
		</>
	);
};

export default HazardLocalEffectsTable;
