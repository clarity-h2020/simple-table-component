import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch} from "react-router-dom";
import './index.css';
import * as serviceWorker from './serviceWorker';

import App from './App';

ReactDOM.render(
  <main>
    <BrowserRouter>
    <Switch>
      <App />
      </Switch>
    </BrowserRouter>
  </main>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
