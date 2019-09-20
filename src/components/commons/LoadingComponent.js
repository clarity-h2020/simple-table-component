import React, { Suspense } from 'react';

import GlobalErrorBoundary from './GlobalErrorBoundary.js';

import logo from './../../logo.svg';
import './../../App.css';

/**
 * OMG: Functional Programming WTF!
 * 
 * Here we don't return the react function component directly but a function that, 
 * when invoked with parameter ${LazyComponent} return the actual functional component
 * that lazily (<Suspense>) renders ${LazyComponent} ... :o
 * See https://codesandbox.io/s/610p2v4x4n
 * 
 * However, I haven't found out yet <a href="https://learnwithparam.com/blog/how-to-pass-props-in-react-router/">how to pass props to tis particular route component in React router</a>!
 * So this component is pretty useless ATM.
 */
export default function LoadingComponent(LazyComponent) {

    /**
     * return a function: the actual function component
     */
    return props => (
        <Suspense fallback={
            <GlobalErrorBoundary><div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>Loading Table Component</p>

                </header>
            </div>
            </GlobalErrorBoundary>
        }>
            <LazyComponent {...props} />
        </Suspense>
    );
}