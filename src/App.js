/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

import React, { useEffect, useState, Suspense } from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { createBrowserHistory } from 'history';
import queryString from 'query-string';
import log from 'loglevel';


//import GenericEmikatTable from "./components/GenericEmikatTable"; // -> Lazy
import { CSISRemoteHelpers, CSISHelpers, EMIKATHelpers } from 'csis-helpers-js'

import GenericEmikatClient from './components/GenericEmikatClient';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
//import emikatCredentials from './__fixtures__/emikatCredentials.js';
//import ParameterSelectionComponent from "./components/ParameterSelectionComponent";

import logo from './logo.svg';
import './App.css';

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

log.enableAll();

/**
 * A functional component is just a plain JavaScript function which accepts props as an argument and returns a React element. 
 */
function App(props) {

  /**
     * Query params extracted from CSIS Helpers. See /examples and /fixtures/csisHelpers.json
     */
  var queryParams;

  // get actual query params from query string ....
  if (props.location && props.location.search) {
    // copy default query params and extend using spread operator :o
    queryParams = { ...CSISHelpers.defaultQueryParams, ...queryString.parse(props.location.search) };
  } else {
    log.warn('no query parameters found, showing empty table!')
  }

  // Code Splitting test
  // https://reactjs.org/docs/code-splitting.html
  const GenericEmikatTable = React.lazy(() => import('./components/GenericEmikatTable.js'));
  const ParameterSelectionComponent = React.lazy(() => import('./components/ParameterSelectionComponent.js'));


  // useState returns an array with 2 elements, and we’re using **ES6 destructuring** to assign names to them
  const [emikatCredentials, setEmikatCredentials] = useState();
  const [emikatTemplateUrl, setEmikatTemplateUrl] = useState(`https://service.emikat.at/EmiKatTst/api/scenarios/2846/feature/view.2974/table/data?rownum=100&filter=STUDY_VARIANT%3D%27BASELINE%27&filter=TIME_PERIOD%3D%27${EMIKATHelpers.TIME_PERIOD}%27&filter=EMISSIONS_SCENARIO%3D%27${EMIKATHelpers.EMISSIONS_SCENARIO}%27&filter=EVENT_FREQUENCY%3D%27${EMIKATHelpers.EVENT_FREQUENCY}%27&filter=SZ_ID%3D${EMIKATHelpers.EMIKAT_STUDY_ID}`);


  /**
   * The Effect Hook lets you perform side effects in function components. 
   * Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects. 
   * If you’re familiar with React class lifecycle methods, you can think of useEffect Hook as componentDidMount, componentDidUpdate, and componentWillUnmount combined.
   */
  useEffect(() => {
    // Effect callbacks are synchronous to prevent race conditions. Put the async function inside!

    const fetchEmikatCredentials = async () => {
      try {
        const theEmikatCredentials = await CSISRemoteHelpers.getEmikatCredentialsFromCsis();
        log.debug(`Emikat Credentials retrieved: ${theEmikatCredentials}`);
        setEmikatCredentials(theEmikatCredentials);
        /*response.catch((error) => {
          console.error('error caught in promise', error);
          setData((d) => ({ ...d, users: [], isFetching: false }));
        });*/

        // the functional update form (here implemented as arrow function) of setState lets us specify how the state needs to change without referencing the current state.
        // The function will receive the previous value, and return an updated value. We call it 'd' instead of data.
        // Therefore we don't need data and users in the list of dependencies but just data.url :o
      } catch (error) {
        console.error('error caught in fetchEmikatCredentials', error);

        // this hack does not work: https://github.com/facebook/react/issues/14981#issuecomment-468460187
        setEmikatCredentials(() => {
          throw error;
        });
      }
    };

    fetchEmikatCredentials();

    /*return function cleanup() {
      console.log('cleanup fetchEmikatCredentials fetching');
    };*/

  }, []); // run effect only once -> See https://css-tricks.com/run-useeffect-only-once/

  /*useEffect(() => {
    console.log('location changed:' + JSON.stringify(props.location));
    if (props.location && props.location.search) {
      const values = queryString.parse(props.location.search)
      if (values.url && values.url !== null) {
        setApplicationState((state) => ({ ...state, url: values.url, isFetching: false }));
      }
    }
  }, [props.location]);*/

  /**
   * Handles the onChange event in the url input field ...
   * @param {string} value 
   */
  function handleChange(value) {
    setEmikatTemplateUrl(value);
  }

  if (emikatCredentials) {
    return (
      <GlobalErrorBoundary>
        <main>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path={`${process.env.PUBLIC_URL}/SimpleTable/`}>
                  <label htmlFor="emikatTemplateUrl"> Time Period </label>
                  <input size="200" value={emikatTemplateUrl} onChange={e => handleChange(e.target.value)} />
                  <ParameterSelectionComponent
                    emikatTemplateUrl={emikatTemplateUrl}
                    emikatParameters={{
                      emikatStudyId: 2846,
                      timePeriod: EMIKATHelpers.TIME_PERIOD_VALUES[0],
                      emissionScenario: EMIKATHelpers.EMISSIONS_SCENARIO_VALUES[0],
                      eventFrequency: EMIKATHelpers.EVENT_FREQUENCY_VALUES[0]
                    }}
                    emikatCredentials={emikatCredentials}
                    client={GenericEmikatClient}
                    render={GenericEmikatTable}>
                  </ParameterSelectionComponent>
                </Route>
                <Route>
                  <div className="App">
                    <header className="App-header">
                      <img src={logo} className="App-logo" alt="logo" />
                      <p>
                        Edit <code>src/App.js</code> and save to reload.
        </p>
                      <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn React
        </a>
                    </header>
                    { /* React ...props syntax:
      ...data instead of data={data.users}, 
      https://www.robinwieruch.de/react-pass-props-to-component/#react-props-syntax-spread-rest*/ }


                  </div>
                </Route>
              </Switch>
            </Suspense>
          </BrowserRouter>
        </main>
      </GlobalErrorBoundary>
    );
  } else {

    return (
      <GlobalErrorBoundary><div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Loading Table Component</p>

        </header>
      </div>
      </GlobalErrorBoundary>);
  }
}

/**
 * Steps for loading tabular data from EMIKAT API 
 * 1) get **EMIKAT credentials** from CSIS API -> requires authenticated user logging in CSIS
 * 2) get `$emikat_id` from study group node -> requires study id obtained from query param or seamless.js iFrame communication
 * 3) get **Data Package** from study group node and extract emikat **resources**
 *    - filter by **EU-GL step** obtained from query param or seamless.js iFrame communication
 *    - `taxonomy_term--service_type` from tags with value 'EMIKAT' (?)
 *    - refence type with value `EMIKAT:table`? from references array?
 */
export default App;
