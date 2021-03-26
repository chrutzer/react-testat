import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../reducers";
import { connect } from "react-redux";

function PrivateRoute({ component, isAuthenticated, ...rest }) {
  if (isAuthenticated) {
    // if the user is authenticated, just render the component
    return (
      <Route
        {...rest}
        render={props =>
          React.createElement(component, { ...props})
        }
      />
    );
  } else {
    // otherwise redirect to the login page
    return (
      <Route
        {...rest}
        render={props => (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )}
      />
    );
  }
}


const mapStateToProps = (state) => {
  return {
      isAuthenticated: isAuthenticated(state)
  }
}


export default connect(mapStateToProps)(PrivateRoute);