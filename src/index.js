import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from "react-router-dom";
import './index.css';
import * as serviceWorker from './serviceWorker';
import GlobalErrorBoundary from './components/commons/GlobalErrorBoundary.js';

import App from './App';

ReactDOM.render(
  <main>
    <GlobalErrorBoundary>
      {/*<!-- 
      This is madness: if we don't wrap <App> in <BrowserRouter/Switch> then we don't have access to props.location within <App>
      But ... we have to repeat BrowserRouter/Switch in App otherwise switch will not work. :-(
    -->*/}
      <BrowserRouter>
        <Switch>
          <App />
        </Switch>
      </BrowserRouter>
    </GlobalErrorBoundary>
  </main >,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
