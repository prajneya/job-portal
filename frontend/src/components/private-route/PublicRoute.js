import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PublicRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === false ? (
        <Component {...props} />
      ) :
      auth.isAuthenticated === true && auth.user['userType'] == "0" ? (
        <Redirect to="/dashboard" />
      ) :
      auth.isAuthenticated === true && auth.user['userType'] == "1" ? (
        <Redirect to="/recruiter/dashboard" />
      ) : ""
    }
  />
);

PublicRoute.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PublicRoute);