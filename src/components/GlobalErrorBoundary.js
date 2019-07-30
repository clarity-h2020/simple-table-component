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
 */
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error);
  }

  reset = () => {
    this.setState({ hasError: false });
  }

  // https://danburzo.github.io/react-recipes/recipes/error-boundaries.html
  render() {
    //console.log('hasError:' + this.state.hasError);
    if (this.state.hasError) {
      return (
        <>
        <div>
          <h1>Meteorite Explorer encountered an error! Oh My!</h1>
        </div>
        <button onClick={this.reset}>Try again</button>
        </>
      );
    }
    
    return this.props.children; 
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