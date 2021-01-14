import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPersonalSettings, getRecruiterSettings, updatePersonalSettings, logoutUser } from "../../actions/authActions";
import { getSkills } from "../../actions/jobAction";

import axios from "axios";
import Select from 'react-select';

import Topbar from './Topbar.js';
import './CreateJob.css';

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

  componentDidMount(){
    this.props.getSkills();
  }

  onChange = e => {
      this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    const { user } = this.props.auth;

    const options = this.props.job.skills

    return (

      <>
        <Topbar />

        <div className="container">

          <div className="mt-5 p-5 profile-card">
            <form>
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
                      <td><input type="number" min="0" max="6" className="pl-3 date-input rounded-pill border border-info form-control bg-white" id="name" required/></td>
                      <td><input type="text" className="salary-input pl-3 form-control border border-info bg-white" id="name" required/></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="float-right ml-5 btn rounded-pill btn-info">CREATE NEW JOB LISTING ></button>
            </form>
            
          </div>
          
        </div>
        

      </>
    );
  }
}

CreateJob.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getPersonalSettings: PropTypes.func.isRequired,
  getRecruiterSettings: PropTypes.func.isRequired,
  updatePersonalSettings: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getSkills: PropTypes.func.isRequired,
  skills: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  personal: state.personal,
  recruiter: state.recruiter,
  job: state.job
});
export default connect(
  mapStateToProps,
  { getPersonalSettings, getRecruiterSettings, updatePersonalSettings, getSkills, logoutUser }
)(CreateJob);