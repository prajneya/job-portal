import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

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
        value: [2000, 7000]
      };
  }

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
  }

  render() {
    const { user } = this.props.auth;

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
                  <div className="col-lg-4 my-2">
                    <div className="job-card p-3">
                      <div className="job-image"><img src="images/hacker.png"/></div>
                      <br/>
                      <div className="ellipsis">5.0 &nbsp;<i><FontAwesomeIcon icon={faStar} color="#ffd500" /></i></div>
                      <div className="recruiter-name">Prajneya Kumar</div>
                      <div className="job-header"><strong>UI / UX Designer</strong></div>
                      <div className="recruiter-name text-success">Submitted at: 12/03/2020</div>
                      <br/>
                      <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                      <div className="tags">
                        <div className="tag mr-2 mt-2 px-3 py-1">Full Time</div>
                        <div className="tag mr-2 mt-2 px-3 py-1">2 months</div>
                        <div className="tag mr-2 mt-2 px-3 py-1">₹ 72000</div>
                      </div>
                      <div className="action-buttons mt-4">
                        <div className="row">
                          <div className="col-md-6 mt-2">
                            <button className="btn btn-primary py-2 px-3 w-100 d-inline-block bg-info"><strong>Pending</strong></button>
                          </div>
                          <div className="col-md-6 mt-2">
                            <button className="btn light-button py-2 px-3 w-100 d-inline-block">View Submission</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 my-2">
                    <div className="job-card p-3">
                      <div className="job-image"><img src="images/astronaut.png"/></div>
                      <br/>
                      <div className="ellipsis">4.7 &nbsp;<i><FontAwesomeIcon icon={faStar} color="#ffd500" /></i></div>
                      <div className="recruiter-name">Prajneya Kumar</div>
                      <div className="job-header"><strong>Sr. Product Designer</strong></div>
                      <div className="recruiter-name text-success">Submitted at: 12/03/2020</div>
                      <br/>
                      <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                      <div className="tags">
                        <div className="tag mr-2 mt-2 px-3 py-1">Full Time</div>
                        <div className="tag mr-2 mt-2 px-3 py-1">2 months</div>
                        <div className="tag mr-2 mt-2 px-3 py-1">₹ 72000</div>
                      </div>
                      <div className="action-buttons mt-4">
                        <div className="row">
                          <div className="col-md-6 mt-2">
                            <button className="btn btn-primary py-2 px-3 w-100 d-inline-block bg-info"><strong>Pending</strong></button>
                          </div>
                          <div className="col-md-6 mt-2">
                            <button className="btn light-button py-2 px-3 w-100 d-inline-block">View Submission</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 my-2">
                    <div className="job-card p-3">
                      <div className="job-image"><img src="images/bug.png"/></div>
                      <br/>
                      <div className="ellipsis">4.5 &nbsp;<i><FontAwesomeIcon icon={faStar} color="#ffd500" /></i></div>
                      <div className="recruiter-name">Prajneya Kumar</div>
                      <div className="job-header"><strong>User Experience Designer</strong></div>
                      <div className="recruiter-name text-success">Submitted at: 12/03/2020</div>
                      <br/>
                      <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                      <div className="tags">
                        <div className="tag mr-2 mt-2 px-3 py-1">Full Time</div>
                        <div className="tag mr-2 mt-2 px-3 py-1">2 months</div>
                        <div className="tag mr-2 mt-2 px-3 py-1">₹ 72000</div>
                      </div>
                      <div className="action-buttons mt-4">
                        <div className="row">
                          <div className="col-md-6 mt-2">
                            <button className="btn btn-primary py-2 px-3 w-100 d-inline-block bg-danger"><strong>Rejected</strong></button>
                          </div>
                          <div className="col-md-6 mt-2">
                            <button className="btn light-button py-2 px-3 w-100 d-inline-block">View Submission</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 my-2">
                    <div className="job-card p-3">
                      <div className="job-image"><img src="images/ninja.png"/></div>
                      <br/>
                      <div className="ellipsis">4.9 &nbsp;<i><FontAwesomeIcon icon={faStar} color="#ffd500" /></i></div>
                      <div className="recruiter-name">Prajneya Kumar</div>
                      <div className="job-header"><strong>Product Designer</strong></div>
                      <div className="recruiter-name text-success">Submitted at: 12/03/2020</div>
                      <br/>
                      <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                      <div className="tags">
                        <div className="tag mr-2 mt-2 px-3 py-1">Full Time</div>
                        <div className="tag mr-2 mt-2 px-3 py-1">2 months</div>
                        <div className="tag mr-2 mt-2 px-3 py-1">₹ 72000</div>
                      </div>
                      <div className="action-buttons mt-4">
                        <div className="row">
                          <div className="col-md-6 mt-2">
                            <button className="btn btn-primary py-2 px-3 w-100 d-inline-block bg-success"><strong>Accepted</strong></button>
                          </div>
                          <div className="col-md-6 mt-2">
                            <button className="btn light-button py-2 px-3 w-100 d-inline-block">View Submission</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Applications);