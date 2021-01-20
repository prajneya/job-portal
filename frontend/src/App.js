import React, { Component } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';

import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

// Routes
import PrivateApplicantRoute from "./components/private-route/PrivateApplicantRoute";
import PrivateRecruiterRoute from "./components/private-route/PrivateRecruiterRoute";
import PublicRoute from "./components/private-route/PublicRoute";

// Components
import Home from './components/Home/Home';
import Register from './components/Home/Register';
import Dashboard from "./components/Applicant/Dashboard";
import Profile from "./components/Applicant/Profile";
import Applications from "./components/Applicant/Applications";

import RDashboard from "./components/Recruiter/RDashboard";
import RProfile from "./components/Recruiter/Profile";
import CreateJob from "./components/Recruiter/CreateJob";
import Job from "./components/Recruiter/Job";
import EditJob from "./components/Recruiter/EditJob";
import Employees from "./components/Recruiter/Employees";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <Switch>
              <PublicRoute path="/" component={Home} exact />
              <PublicRoute path="/register" component={Register} exact />
              <PrivateApplicantRoute exact path="/dashboard" component={Dashboard} />
              <PrivateApplicantRoute exact path="/profile" component={Profile} />
              <PrivateApplicantRoute exact path="/applications" component={Applications} />
              <PrivateRecruiterRoute exact path="/recruiter/dashboard" component={RDashboard} />
              <PrivateRecruiterRoute exact path="/recruiter/profile" component={RProfile} />
              <PrivateRecruiterRoute exact path="/recruiter/create" component={CreateJob} />
              <PrivateRecruiterRoute exact path="/recruiter/job/:id" component={Job} />
              <PrivateRecruiterRoute exact path="/recruiter/editJob/:id" component={EditJob} />
              <PrivateRecruiterRoute exact path="/recruiter/employees" component={Employees} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
