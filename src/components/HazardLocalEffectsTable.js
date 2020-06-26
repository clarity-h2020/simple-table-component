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
	const emikatTemplateUrl = `https://service.emikat.at/EmiKatTst/api/scenarios/${EMIKATHelpers.EMIKAT_STUDY_ID}/feature/view.2974/table/${EMIKATHelpers.DATA_FORMAT}?rownum=1000&filter=SZ_ID=${EMIKATHelpers.EMIKAT_STUDY_ID}&filter=STUDY_VARIANT%3D%27${EMIKATHelpers.STUDY_VARIANT}%27&filter=TIME_PERIOD%3D%27${EMIKATHelpers.TIME_PERIOD}%27&filter=EMISSIONS_SCENARIO%3D%27${EMIKATHelpers.EMISSIONS_SCENARIO}%27&filter=EVENT_FREQUENCY%3D%27${EMIKATHelpers.EVENT_FREQUENCY}%27`;
	/**
   * o.k., we could handle this columns stuff in a generic way and include it in csis-helpers-js as a *special case* of 
   * EMIKAT URI parametrization, but hey, KISS and YAGNI anyone? ATM column names are not treated as $variables anyway. 
   * 
   * Inconsistency alert: `EVENT_FREQUENCY` is called `Frequence` in EE API :-(
   * */
	const columns =
		'&column=GRID_ID&column=STUDY_VARIANT&column=TIME_PERIOD&column=EMISSIONS_SCENARIO&column=EVENT_FREQUENCY&column=T_MRT&column=T_UTCI&column=T_A&column=DISCOMFORT_LEVEL';

	const resolveData = function (data) {
		data.map(function transform(row) {
			row.values[5] = row.values[5] !== null && !isNaN(parseFloat(row.values[5])) ?
				Math.round(row.values[5] * 100 + Number.EPSILON) / 100 + ' °C' : 'n/a';

			row.values[6] = (row.values[6] !== null && isNaN(parseFloat(row.values[6])) === false) ?
				(Math.round(row.values[6] * 100 + Number.EPSILON) / 100 + ' °C') : 'n/a';

			row.values[7] = row.values[7] !== null && !isNaN(parseFloat(row.values[7])) ?
				Math.round(row.values[7] * 100 + Number.EPSILON) / 100 + ' °C' : 'n/a';

			return row;
		});

		return data;
	};

	return (
		<>
			<p>The table lists mean-, UTCI (Universal Thermal Climate Index)- and Apperent Temperature and Discomfort level for different RCP Scenarios.</p>
			<ParameterSelectionComponent
				{...props}
				emikatTemplateUrl={emikatTemplateUrl + columns}
				client={GenericEmikatClient}
				render={GenericEmikatTable}
				props={{ resolveData: resolveData }}>
			</ParameterSelectionComponent>
		</>
	);
};

export default HazardLocalEffectsTable;
