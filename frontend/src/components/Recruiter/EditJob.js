import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPersonalSettings, getRecruiterSettings, updatePersonalSettings, logoutUser } from "../../actions/authActions";
import { getSkills } from "../../actions/jobAction";

import Swal from 'sweetalert2';
import axios from "axios";
import Select from 'react-select';

import Topbar from './Topbar.js';
import './CreateJob.css';

class EditJob extends Component {

  constructor() {
      super();
      this.state = {
        activeSection: 0,
        title: "",
        description: "",
        moa: "",
        mop: "",
        deadline: "",
        skills: "",
        jobType: 0,
        duration: "",
        salary: "",
        jobData: {}
      };
  }

  async componentDidMount(){
    await axios
      .post("/api/jobs/viewJobData", {"id": this.props.match.params.id})
      .then(async res => {
        await this.setState({
          jobData: res.data
        })
        await this.setState({
          moa: String(this.state.jobData.applications),
          mop: String(this.state.jobData.positions),
          deadline: this.state.jobData.deadline
        })
      });

  };

  onChange = e => {
      this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = async e => {
    e.preventDefault();

    if(this.state.deadline.trim()===""){
      await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Job Deadline cannot be empty',
          footer: 'Dont keep too many secrets.'
      })
      return;
    }

    if(this.state.moa.trim()===""){
      await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Maximum number of applications cannot be empty',
          footer: 'Dont keep too many secrets.'
      })
      return;
    }

    if(this.state.moa <=0 ){
      await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Maximum number of applications cannot be less than equal to zero',
          footer: 'Please enter a valid input.'
      })
      return;
    }

    if(!(/^\d+$/.test(this.state.moa))){
      await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Maximum Number of applications must be a number',
          footer: 'Please enter a valid input.'
      })
      return;
    }

    if(this.state.mop <=0 ){
      await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Maximum number of Positions cannot be less than equal to zero',
          footer: 'Please enter a valid input.'
      })
      return;
    }

    if(this.state.mop.trim()===""){
      await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Maximum number of positions cannot be empty',
          footer: 'Dont keep too many secrets.'
      })
      return;
    }

    if(!(/^\d+$/.test(this.state.mop))){
      await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Maximum Number of positions must be a number',
          footer: 'Please enter a valid input.'
      })
      return;
    }

    const jobData = {
      id: this.props.match.params.id,
      deadline: this.state.deadline,
      applications: this.state.moa,
      positions: this.state.mop,
    }

    axios
      .post("/api/jobs/edit", jobData)
      .then(async res => {
        await Swal.fire({
          icon: 'success',
          title: 'Job Edited!',
          text: 'The job listing was edited successfully.',
          footer: 'Applicants can apply any time now.'
        })
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: JSON.stringify(err.response.data)
        })
      });

  };

  render() {
    const { user } = this.props.auth;

    const options = this.props.job.skills

    return (

      <>
        <Topbar />

        <div className="container">

          <div className="mt-5 p-5 profile-card">
            <form onSubmit={this.onSubmit}>
              <div className="recruiter-name">{user.name} <span className="text-info">({user.email})</span></div>
              <div className="job-header"><input type="text" className="gui-input" id="title" value={this.state.jobData.title} placeholder="Your Job Listing Title"></input></div>
              <div className="text-secondary"><textarea className="gui-text-area" id="description" value={this.state.jobData.description} ></textarea> </div>
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
                      <td><input type="text" className="gui-other-input text-center border border-info" id="moa" defaultValue={this.state.jobData.applications} onChange={this.onChange}></input></td>
                      <td><input type="text" className="gui-other-input text-center border border-info" id="mop" defaultValue={this.state.jobData.positions} onChange={this.onChange}></input></td>
                      <td><input type="datetime-local" className="gui-other-input date-input border border-info rounded-pill text-center" defaultValue={this.state.jobData.deadline ? this.state.jobData.deadline.substring(0, this.state.jobData.deadline.length-5) : ""} id="deadline" onChange={this.onChange}></input></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <label>REQUIRED SKILLS</label> &nbsp;
              {this.state.jobData.skillset && this.state.jobData.skillset.map(skill => (
                <div className="tag mr-2 mt-2 px-3 py-1 bg-success text-white">{skill}</div>
              ))}  <br/>
              <label className="mt-4">TYPE OF JOB: </label>
              <select className="ml-5 sort-select" id="jobType" value={this.state.jobData.jobType}>
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
                      <td><input type="number" min="0" max="6" className="pl-3 date-input rounded-pill border border-warning form-control bg-white text-center" id="duration" value={this.state.jobData.duration}/></td>
                      <td><input type="text" className="salary-input pl-3 form-control border border-warning bg-white text-center" id="salary" value={this.state.jobData.salary}/></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="float-right ml-5 btn rounded-pill btn-warning">UPDATE JOB LISTING ></button>
            </form>
            
          </div>
          
        </div>
        

      </>
    );
  }
}

EditJob.propTypes = {
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
)(EditJob);