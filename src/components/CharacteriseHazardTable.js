import React from 'react';
import log from 'loglevel';

import { EMIKATHelpers } from 'csis-helpers-js';
import GenericEmikatClient from './commons/GenericEmikatClient.js';
import ParameterSelectionComponent from './commons/ParameterSelectionComponent.js';
import GenericEmikatTable from './commons/GenericEmikatTable.js';
import { Route } from 'react-router';

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
  const emikatTemplateUrl = `https://service.emikat.at/EmiKatTst/api/scenarios/${EMIKATHelpers.EMIKAT_STUDY_ID}/feature/tab.CLY_HAZARD_EVENTS_STUDY.2036/table/${EMIKATHelpers.DATA_FORMAT}?rownum=1000`;

  // `Hazard Event Type ID` - Column names with whitespaces :-(
  // urban_area & country - should be 'consolidated (#13) but it isn't working anyway (https://github.com/clarity-h2020/emikat/issues/40) -> YAGNI. remove it!
  // WARNING: Colum filter is case sensitive and case of column names change: latitude vs Latitude :-(
  const columns =
    '&column=Latitude&column=Longitude&column=Hazard Event Type&column=EMISSIONS_SCENARIO&column=TIME_PERIOD&column=EVENT_FREQUENCY&column=Event Descriptor&column=Temp95Perz';

  const resolveData = function (data) {
    data.map(function transform(row) {
      //log.debug(row);



      if (row.values[2] === 'HW' && row.values[6] && row.values[6] != null) {
        const eventDescriptor = row.values[6].split('_');
        if (eventDescriptor.length > 0 && eventDescriptor[1]) {
          row.values[6] = `${eventDescriptor[1].substring(0, eventDescriptor[1].length - 1)} days at ${eventDescriptor[0]}°C`;
        } else {
          row.values[6] = eventDescriptor[0] + '°C';
        }
      } else if (row.values[2] === 'RAIN' && row.values[6] && row.values[6] != null) {
        row.values[6] += ' mm';
      }

      row.values[2] = row.values[2] === 'HW' ? 'Heat Wave' : row.values[2];
      row.values[2] = row.values[2] === 'RAIN' ? 'Heavy Rainfall' : row.values[2];

      row.values[7] = row.values[7] !== null ? row.values[7] + '°C' : 'n/a';

      return row;
    });

    return data;
  };

  return (
    <ParameterSelectionComponent
      {...props}
      emikatTemplateUrl={emikatTemplateUrl + columns}
      client={GenericEmikatClient}
      render={GenericEmikatTable}
      props={{ resolveData: resolveData }}>
    </ParameterSelectionComponent>);
};

export default CharacteriseHazardTable;