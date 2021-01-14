import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPersonalSettings, getRecruiterSettings, updatePersonalSettings, logoutUser } from "../../actions/authActions";

import axios from "axios";
import Select from 'react-select';

import Topbar from './Topbar.js';
import './CreateJob.css';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

class CreateJob extends Component {

  constructor() {
      super();
      this.state = {
        activeSection: 0,
        name: -1,
        email: -1,
        photo: -1,
        institution: "",
        start: "",
        end: "",
        resume: -1
      };
  }

  onChange = e => {
      this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    const { user } = this.props.auth;

    return (
      <>
        <Topbar />

        <div className="container">

          <div className="mt-5 px-5 py-4 profile-card">
            <div className="recruiter-name">{user.name} <span className="text-info">({user.email})</span></div>
            <div className="job-header"><input type="text" className="gui-input" placeholder="Your Job Listing Title"></input></div>
            <div className="text-secondary"><textarea className="gui-text-area" placeholder="Add a short description about the job here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." ></textarea> </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" className="text-center">MAX NO. OF APPLICATIONS</th>
                    <th scope="col" className="text-center">MAX NO. OF POSITIONS</th>
                    <th scope="col" className="text-center">DEADLINE FOR APPLICATIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" className="gui-other-input text-center border border-info"></input></td>
                    <td><input type="text" className="gui-other-input text-center border border-info"></input></td>
                    <td><input type="datetime-local" className="gui-other-input date-input border border-info rounded-pill text-center"></input></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <label>REQUIRED SKILLS</label>
            <Select
              defaultValue={[options[2], options[0]]}
              isMulti
              name="colors"
              options={options}
              className="basic-multi-select"
              classNamePrefix="select"
            />
            <label className="mt-4">TYPE OF JOB: </label>
            <select className="ml-5 sort-select">
              <option value="0">Full Time</option>
              <option value="1">Part Time</option>
              <option value="2">Work From Home</option>
            </select>
            <br/><hr/>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" className="text-center">DURATION</th>
                    <th scope="col" className="text-center">SALARY (per month)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="number" min="0" max="6" className="pl-3 date-input rounded-pill form-control bg-white" id="name" required/></td>
                    <td><input type="text" className="salary-input pl-3 form-control bg-white" id="name" required/></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
          </div>
          
        </div>
        

      </>
    );
  }
}

CreateJob.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getPersonalSettings: PropTypes.func.isRequired,
  getRecruiterSettings: PropTypes.func.isRequired,
  updatePersonalSettings: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  personal: state.personal,
  recruiter: state.recruiter
});
export default connect(
  mapStateToProps,
  { getPersonalSettings, getRecruiterSettings, updatePersonalSettings, logoutUser }
)(CreateJob);