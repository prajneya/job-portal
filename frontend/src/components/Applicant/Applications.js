import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getMyApplications } from './../../actions/jobAction.js';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faSortNumericUp, faSortNumericDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import Slider from '@material-ui/core/Slider';

import Topbar from './Topbar.js'

import './Dashboard.css';

class Applications extends Component {

  constructor() {
      super();
      this.state = {
        firstCheck: 0,
        displayApplications: [],
        applications: []
      };
  }

  componentDidMount = () => {
    this.props.getMyApplications({"id": this.props.auth.user.id});
  };

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  
  handleChange = (event, newValue) => {
    this.setState({
      value: newValue
    });
  };

  dashboardCallback = () => {
    this.props.history.push('/dashboard')
  };

  applicationViewCallback = (id) => {
    this.props.history.push('/application/'+id)
  }

  render() {
    const { user } = this.props.auth;

    if(this.state.firstCheck===0 && this.props.job.applications.length > 0){
      this.setState({
        applications: this.props.job.applications,
        displayApplications: this.props.job.applications,
        firstCheck: 1
      })
    }

    return (
      <>
        <Topbar />

        <div className="container-fluid">
          <br/>
          <div className="row mx-1 mt-3">
            <div className="col-lg-2 desktop-only">
              <div className="sidebar-alert-box py-3 px-4">
                <label><span style={{"color": "black"}}>Stay on the Lookout</span></label>
                <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                <button className="btn btn-primary" onClick={this.dashboardCallback}>Explore Jobs > </button>
              </div>
              <div className="filter-header mt-3 mx-2">
                <label>Your Applications</label>
                <div class="radio radio-primary mt-2">
                  <input id="all" type="radio" name="applications" />
                  <label for="all" className="filter-label text-secondary">All Applications</label>
                </div>
                <div class="radio radio-primary">
                  <input id="pending" type="radio" name="applications" />
                  <label for="pending" className="filter-label text-secondary">Pending Applications</label>
                </div>
                <div class="radio radio-primary">
                  <input id="rejected" type="radio" name="applications" />
                  <label for="rejected" className="filter-label text-secondary">Rejected Applications</label>
                </div>
                <div class="radio radio-primary">
                  <input id="accepted" type="radio" name="applications" />
                  <label for="accepted" className="filter-label text-secondary">Accepted Applications</label>
                </div>
              </div>
            </div>
            <div className="col-lg-10">
              <h4 className="jobs-header">Showing All Applications</h4>
              <div className="jobs-listing mt-5">
                <div class="row">
                  {this.state.displayApplications.map(application_item => ( 
                    <div className="col-lg-4 my-2">
                      <div className="job-card p-3">
                        <div className="job-image"><img src={"images/"+application_item['job']['image']}/></div>
                        <br/>
                        <div className="recruiter-name">{application_item['job']['name']}</div>
                        <div className="job-header"><strong>{application_item['job']['title']}</strong></div>
                        <div className="recruiter-name text-success">Submitted at: {application_item['application']['createdAt']}</div>
                        <br/>
                        <p className="text-secondary">{application_item['job']['description']} </p>
                        <div className="tags">
                        {application_item['job']['jobType'] === 0 ? <div className="tag mr-2 mt-2 px-3 py-1">Full Time</div> : "" }
                        {application_item['job']['jobType'] === 1 ? <div className="tag mr-2 mt-2 px-3 py-1">Part Time</div> : "" }
                        {application_item['job']['jobType'] === 2 ? <div className="tag mr-2 mt-2 px-3 py-1">Work from Home</div> : "" }
                        <div className="tag mr-2 mt-2 px-3 py-1">{application_item['job']['duration']} months</div>
                        <div className="tag mr-2 mt-2 px-3 py-1">₹ {application_item['job']['salary']}</div>
                      </div>
                        <div className="action-buttons mt-4">
                          <div className="row">
                            <div className="col-md-6 mt-2">
                              {application_item['application']['status'] === 0 ? <button className="btn btn-primary py-2 px-3 w-100 d-inline-block bg-info"><strong>Pending</strong></button> : "" }
                              {application_item['application']['status'] === 1 ? <button className="btn btn-primary py-2 px-3 w-100 d-inline-block bg-primary"><strong>Shortlisted</strong></button> : "" }
                              {application_item['application']['status'] === 2 ? <button className="btn btn-primary py-2 px-3 w-100 d-inline-block bg-success"><strong>Accepted</strong></button> : "" }
                              {application_item['application']['status'] === 3 ? <button className="btn btn-primary py-2 px-3 w-100 d-inline-block bg-danger"><strong>Rejected</strong></button> : "" }
                              {application_item['application']['status'] === 4 ? <button className="btn btn-primary py-2 px-3 w-100 d-inline-block bg-warning"><strong>Depriciated</strong></button> : "" }
                            </div>
                            <div className="col-md-6 mt-2">
                              <button className="btn light-button py-2 px-3 w-100 d-inline-block" onClick={() => this.applicationViewCallback(application_item['application']['_id'])}>View Submission</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        

      </>
    );
  }
}

Applications.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getMyApplications: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,
  job: state.job,
});
export default connect(
  mapStateToProps,
  { getMyApplications, logoutUser }
)(Applications);