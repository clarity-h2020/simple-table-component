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
import { Switch, BrowserRouter, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';
import queryString from 'query-string';
import log from 'loglevel';

import { CSISRemoteHelpers, CSISHelpers } from 'csis-helpers-js'
import GlobalErrorBoundary from './components/commons/GlobalErrorBoundary.js';


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
  //log.debug(`App props: ${JSON.stringify(props)}`);
  // Yes, this is **e,mpty** in react DEV mode! :-(
  //log.debug('process.env.PUBLIC_URL:' + process.env.PUBLIC_URL);

  /**
     * Query params extracted from CSIS Helpers. See /examples and /fixtures/csisHelpers.json
     */
  var queryParams = { ...CSISHelpers.defaultQueryParams };

  // get actual query params from query string ....
  if (props.location && props.location.search) {
    // copy default query params and extend using spread operator :o
    queryParams = { ...queryParams, ...queryString.parse(props.location.search) };
  } else {
    log.warn('no query parameters found, showing empty table!')
  }

  // Code Splitting test
  // https://reactjs.org/docs/code-splitting.html
  const RiskAndImpactTable = React.lazy(() => import('./components/RiskAndImpactTable.js'));
  const ExposureTable = React.lazy(() => import('./components/ExposureTable.js'));

  // useState returns an array with 2 elements, and we’re using **ES6 destructuring** to assign names to them
  const [emikatCredentials, setEmikatCredentials] = useState();

  /**
   * The Effect Hook lets you perform side effects in function components. 
   * Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects. 
   * If you’re familiar with React class lifecycle methods, you can think of useEffect Hook as componentDidMount, componentDidUpdate, and componentWillUnmount combined.
   * 
   * TODO: here we could fetch the EMIKAT URL from the Data Package instead of hardcoding it in the specifiy Table Components. Probably YAGNI ...
   */
  useEffect(() => {
    // Effect callbacks are synchronous to prevent race conditions. Put the async function inside!

    const fetchEmikatCredentials = async () => {
      try {
        const theEmikatCredentials = await CSISRemoteHelpers.getEmikatCredentialsFromCsis();
        //log.debug(`Emikat Credentials retrieved: ${theEmikatCredentials}`);
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

        // hacketyhack: https://github.com/facebook/react/issues/14981#issuecomment-468460187
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

  function WaitingComponent() {
    return (
      <GlobalErrorBoundary>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>Loading Table Component</p>
          </header>
        </div>
      </GlobalErrorBoundary>
    );
  }

  if (!queryParams || !queryParams.emikat_id) {
    log.debug(JSON.stringify(queryParams));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Table Component not initilaised correctly</h2>
          <p>Query Parametes, e.g. <i>emikat_id</i> missing!</p>
        </header>
      </div>
    );
  }
  else if (emikatCredentials) {
    return (
      <BrowserRouter>
        {/*<!-- BrowserRouter/Switch already defined in index.js otherwise propos.location would be undefined.
        Why do we have to repeat it here? I don't know but if we don't do it Switch will not work an show ll routes
      -->*/}
        <Switch>
          <Route path={`${process.env.PUBLIC_URL}/RiskAndImpactTable`}>
            <Suspense fallback={<WaitingComponent />}>
              <RiskAndImpactTable
                emikatParameters={{
                  emikatStudyId: queryParams.emikat_id,
                  studyVariant: queryParams.study_variant,
                  timePeriod: queryParams.time_period,
                  emissionsScenario: queryParams.emissions_scenario,
                  eventFrequency: queryParams.event_frequency
                }}
                emikatCredentials={emikatCredentials}>
              </RiskAndImpactTable>
            </Suspense>
          </Route>
          <Route path={`${process.env.PUBLIC_URL}/ExposureTable`}>
            <Suspense fallback={<WaitingComponent />}>
              <ExposureTable
                emikatParameters={{
                  emikatStudyId: queryParams.emikat_id
                }}
                emikatCredentials={emikatCredentials}>
              </ExposureTable>
            </Suspense>
          </Route>
          {/*<!-- 
          Yes, the order **is** important, especially in DEV mode when is ${process.env.PUBLIC_URL} is **empty**!
          See also https://github.com/clarity-h2020/simple-table-component/issues/6#issuecomment-533518226 -->*/}
          <Route exact path={process.env.PUBLIC_URL} component={WaitingComponent} />
        </Switch>
      </BrowserRouter >
    );
  } else {
    return (<WaitingComponent />);
  }
}

/**
 * Steps for loading tabular data from EMIKAT API 
 * 1) get **EMIKAT credentials** from CSIS API -> requires authenticated user logging in CSIS
 * 2) get `$emikat_id` from study group node -> requires study id obtained from query param or seamless.js iFrame communication
 * 3) get **Data Package** from study group node and extract emikat **resources**
 *    - filter by **EU-GL step** obtained from query param or seamless.js iFrame communication
 *    - `taxonomy_term--service_type` from tags with value 'EMIKAT' (?)
 *    - reference type with value `EMIKAT:table`? from references array?
 */
export default App;
