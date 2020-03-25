import CSISResource from '../classes/CSISResource';
// see https://github.com/clarity-h2020/simple-table-component/issues/4#issuecomment-595115802
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import apiResponseResources from './../__fixtures__/resources.json';

test('test CSISResource getServiceType', () => {
    const csisResource = new CSISResource(apiResponseResources.data[0], apiResponseResources.included);
    const serviceType = csisResource.getServiceType();
    expect(serviceType).not.toBeNull();
    expect(serviceType.attributes.name).toEqual('ogc:wfs');
});