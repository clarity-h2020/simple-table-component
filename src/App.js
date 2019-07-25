import React, { useEffect, useState, Suspense } from 'react';
import axios from "axios";
//import GenericEmikatTable from "./components/GenericEmikatTable.js";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";
import logo from './logo.svg';
import './App.css';

function App() {

  // https://reactjs.org/docs/code-splitting.html
  const GenericEmikatTable = React.lazy(() => import('./components/GenericEmikatTable.js'));

  // useState returns an array with 2 elements, and we’re using **ES6 destructuring** to assign names to them
  const [data, setData] = useState({ url: 'https://jsonplaceholder.typicode.com/users', users: [], isFetching: false });

  // You can think of effects as a combination of componentDidMount() and componentDidUpdate() of class-based components.
  // In this case, I want it to run just once, so I pass both a function and an empty array. 
  // The array argument tells the Hook to apply the effect (i.e., run the function) only if the state variables listed in the array are changed.


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log(data.url);
        const response = await axios.get(data.url);
        setData((data) => ({ ...data, users: response.data, isFetching: false }));
      } catch (e) {
        console.log(e);

      }
    };

    fetchUsers();

    return function cleanup() {
      console.log('cleanup');
    };

  }, [data.url]);

  function handleChange(value) {
    setData({ ...data, url: value });
  }

  return (
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

      <input value={data.url} onChange={e => handleChange(e.target.value)} />
      <GlobalErrorBoundary>
      <Suspense fallback={<h2>Product list is loading...</h2>}>
        <GenericEmikatTable {...data} />
        </Suspense>
      </GlobalErrorBoundary>

    </div>
  );
}

export default App;
