import React from 'react';
import PropTypes from "prop-types";

/**
 * Error boundaries are React components that catch JavaScript errors anywhere in their 
 * child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. 
 * 
 * see https://reactjs.org/docs/error-boundaries.html#introducing-error-boundaries
 * 
 * Error Boundaries in create-react-app DEV mode:
 * We don't provide an option to disable the error overlay in development. Error boundaries do not take its place (they are meant for production use).
 * There is no harm having both the development error overlay and your error boundary; simply press [escape] if you'd like to view your error boundary.
 * 
 * see https://stackoverflow.com/questions/46589819/disable-error-overlay-in-development-mode/47398520
 * 
 * **WARNING:** Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. But not in event, effects, async, etc.
 * 
 * TODO: convert to functional component
 * 
 */
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error:undefined, info:undefined };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error:error};
  }

  componentDidCatch(error, info) {
    //log.error('error in componentDidCatch', error);
  }

  reset = () => {
    this.setState({ hasError: false, error:undefined });
  }

  // https://danburzo.github.io/react-recipes/recipes/error-boundaries.html
  render() {
    //console.log('hasError:' + this.state.hasError);
    if (this.state.hasError) {
      //log.warn('error detected');
      return (
        <>
          <div>
            <h1>Table data could not be loaded.</h1>
            <p>The technical error messsge is: {this.state.error.message}</p>
            <p><strong>You are probably not logged in CSIS. Please visist <a href="https://csis.myclimateservice.eu/">https://csis.myclimateservice.eu/</a></strong></p>
          </div>
          <button onClick={this.reset}>Try again</button>
        </>
      );
    } else {
      //log.debug('no error detected');
      return this.props.children;
    }
  }
}

export default GlobalErrorBoundary;

GlobalErrorBoundary.propTypes = {
  /**
   * Resets the Error Boundary and re-renders the child components
   */
  reset: PropTypes.bool
};

GlobalErrorBoundary.defaultProps = {
  reset: false
}