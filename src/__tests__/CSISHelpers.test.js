import axios from 'axios';
import CSISHelpers from './../logic/CSISHelpers.js';
import express from 'express'
import apiResponseStudy from './../__fixtures__/study.json';
import apiResponseDataPackage from './../__fixtures__/dataPackage.json';
import apiResponseResources from './../__fixtures__/resources.json';
import studyArea from './../__fixtures__/studyArea.json';

const app = express();
var server;

beforeAll(() => {
    app.get('/jsonapi/group/study', function (req, res) {
        res.json(apiResponseStudy);
    });

    // https://csis.myclimateservice.eu/jsonapi/group/study?filter[id][condition][path]=id&filter[id][condition][operator]=%3D&filter[id][condition][value]=c3609e3e-f80f-482b-9e9f-3a26226a6859');
    app.get('/jsonapi/node/data_package/a8ff7930-4a9f-4289-8246-3383ba13c30f/field_resources', function (req, res) {
        res.json(apiResponseStudy);
    });

    // https://csis.myclimateservice.eu/jsonapi/group/study/c3609e3e-f80f-482b-9e9f-3a26226a6859/field_data_package
    // https://csis.myclimateservice.eu/jsonapi/node/data_package/a8ff7930-4a9f-4289-8246-3383ba13c30f
    app.get('/jsonapi/group/study/c3609e3e-f80f-482b-9e9f-3a26226a6859/field_data_package', function (req, res) {
        res.json(apiResponseDataPackage);
    });

    // https://csis.myclimateservice.eu/jsonapi/node/data_package/a8ff7930-4a9f-4289-8246-3383ba13c30f/field_resources?resourceVersion=id%3A270&include=field_resource_tags,field_map_view,field_references,field_analysis_context.field_field_eu_gl_methodology,field_analysis_context.field_hazard
    app.get('/jsonapi/node/data_package/a8ff7930-4a9f-4289-8246-3383ba13c30f/field_resources', function (req, res) {
        res.json(apiResponseResources);
    });

    server = app.listen(31336, () => console.log('Example app listening on port 3000!'))
});


test.only('test extract study area from study json', async (done) => {
    expect.assertions(5);
    const response = await axios.get('http://localhost:31336/jsonapi/group/study?filter[id][condition][path]=id&filter[id][condition][operator]=%3D&filter[id][condition][value]=c3609e3e-f80f-482b-9e9f-3a26226a6859');
    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data.data).toBeDefined();
    expect(response.data.data[0]).not.toBeNull();

    const studyAreaJson = CSISHelpers.extractStudyAreaFromStudyGroupNode(response.data.data[0]);
    expect(studyAreaJson).toEqual(studyArea);
    done();
});

afterAll(() => {
    console.log('afterAll');
    server.close(() => {
        //console.log('JSON Server closed');
        //process.exit(0);
    });
});