import axios from 'axios';
import EMIKATHelpers from './../logic/EMIKATHelpers.js';
import CSISHelpers from './../logic/CSISHelpers.js';
//import {create, router, defaults, rewriter} from 'json-server';
import express from 'express'
import populationExposure from './../__fixtures__/tab.CLY_EL_POPULATION_INTERPOLATED.2016.json';

const app = express();
var server;

beforeAll(() => {
  console.log('beforeAll');
  // respond with "hello world" when a GET request is made to the homepage
  app.get('/EmiKatTst/api/scenarios/2846/feature/tab.CLY_EL_POPULATION_INTERPOLATED.2016/table/data', function (req, res) {
    res.json(populationExposure);
  })

  server = app.listen(31337, () => console.log('Example app listening on port 3000!'))
});

it('adds 1 + 2 to equal 3', () => {
  console.log('test1');
  expect(CSISHelpers.sum(1, 2)).toBe(3);

});

it ('tests JSON API', async (done) => {
  console.log('test2');
  expect.assertions(1);
  const response = await axios.get('http://localhost:31337/EmiKatTst/api/scenarios/2846/feature/tab.CLY_EL_POPULATION_INTERPOLATED.2016/table/data');
  expect(response.data).toEqual(populationExposure);
  done();
});

afterAll(() => {
  console.log('afterAll');
  server.close(() => {
    //console.log('JSON Server closed');
    //process.exit(0);
  });
});