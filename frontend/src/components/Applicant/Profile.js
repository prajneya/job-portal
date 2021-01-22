import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPersonalSettings, getEducationalSettings, updatePersonalSettings, logoutUser } from "../../actions/authActions";
import { getSkills } from "../../actions/jobAction";

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { faStar, faSortNumericUp, faSortNumericDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import Slider from '@material-ui/core/Slider';

import Topbar from './Topbar.js';
import './Profile.css';

class Profile extends Component {

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
        resume: -1,
        skills: [],
        other: false,
        selectedSkill: "C++"
      };
  }

  componentDidMount = () => {
    this.props.getPersonalSettings({"id": this.props.auth.user.id});
    this.props.getEducationalSettings({"id": this.props.auth.user.id});
    this.props.getSkills();
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

  switchPersonalSettings = () => {
    this.setState({
      activeSection: 0
    })
  };

  switchEducationSettings = () => {
    this.setState({
      activeSection: 1
    })
  };

  onChange = e => {
      this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = async e => {
      e.preventDefault();

      if(this.state.name===-1){
        await this.setState({
          name: this.props.auth.personal.name
        })
      }
      if(this.state.email===-1){
        await this.setState({
          email: this.props.auth.personal.email
        })
      }
      
      const userData = {
        id: this.props.auth.user.id,
        name: this.state.name,
        email: this.state.email
      };

      this.props.updatePersonalSettings(userData);
  };

  handlePhoto = async e => {
    await this.setState({
      photo: e.target.files[0]
    })
  };

  handleResume = async e => {
    await this.setState({
      resume: e.target.files[0]
    })
  };

  handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userType', this.props.auth.user.userType);
    formData.append('id', this.props.auth.user.id);
    formData.append('photo', this.state.photo);

    axios
      .post('/api/users/uploadProfilePic', formData)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleResumeSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', this.props.auth.user.id);
    formData.append('resume', this.state.resume);

    axios
      .post('/api/applicant/uploadResume', formData)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  simulateUploadClick = () => {
    document.getElementById("imageUpload").click();
  };

  addInstitution = () => {
    axios
      .post('/api/applicant/addInstitution', {
        "id": this.props.auth.user.id,
        "name": this.state.institution,
        "start": this.state.start,
        "end": this.state.end
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  addSkill = () => {
    axios
      .post('/api/applicant/addSkill', {
        "id": this.props.auth.user.id,
        "skill": this.state.selectedSkill,
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleSkillChange = async () => {
    var sel_value = document.getElementById("skillDropDown").value;
    if(sel_value==="0"){
      await this.setState({
        other: true,
      })
    }
    else{
      await this.setState({
        selectedSkill: sel_value,
        other: false,
      })
    }
  };

  render() {
    const { user, personal, educational } = this.props.auth;
    const options = this.props.job.skills;

    console.log(educational)

    return (
      <>
        <Topbar />

        <div className="container">

          <div className="mt-5 profile-card">
            <div className="row">
              <div className="col-lg-3 desktop-only">
                <div className="settings-tabs my-5 ml-4 py-4">
                  <div className="settings-header pt-2 pb-4 pl-3">My Settings</div>
                  <div className={this.state.activeSection == 0 ? " settings-active settings-item py-2 pl-3" : "settings-item py-2 pl-3"} onClick={this.switchPersonalSettings}>Personal Settings</div>
                  <div className={this.state.activeSection == 1 ? " settings-active settings-item py-2 pl-3" : "settings-item py-2 pl-3"} onClick={this.switchEducationSettings}>Educational Settings</div>
                </div>
              </div>
              <div className="col-lg-9">
                {this.state.activeSection == 0 ? 
                <div className="detailed-section m-5">
                  <div className="image-upload">
                    <form onSubmit={this.handleSubmit} encType='multipart/form-data'>
                      <img className="d-inline-block" src={"images/profilepics/"+educational.profilePic} onClick={this.simulateUploadClick} />
                      <input id="imageUpload" type="file" accept=".png, .jpg, .jpeg" onChange={this.handlePhoto} className="d-none" name="profile_photo" placeholder="Photo" capture />
                      {this.state.photo === -1 ? <div className="text-danger float-right m-5">Click on the picture to change your profile picture.</div> : <><div className="text-danger float-right m-5">Click on the button to continue.</div><button type="submit" className="ml-5 btn rounded-pill btn-info">UPLOAD NEW PHOTO ></button></> }
                    </form>
                  </div>
                  <form onSubmit={this.onSubmit}>
                    <div className="form-details mt-5">
                      <div className="form-group">
                        <label className="pl-3" htmlFor="formGroupExampleInput">FULL NAME</label>
                        <input type="text" className="pl-3 form-control bg-white" id="name" defaultValue={personal.name} onChange={this.onChange} required/>
                      </div>
                      <div className="form-group">
                        <label className="pl-3" htmlFor="formGroupExampleInput">EMAIL</label>
                        <input type="text" className="pl-3 form-control bg-white" id="email" defaultValue={personal.email} onChange={this.onChange} required/>
                      </div>
                      <button className="float-right ml-5 btn rounded-pill btn-info">SAVE DETAILS ></button>
                    </div>
                  </form>
                </div> :
                <div className="detailed-section m-5">
                  <div className="institutions">
                    <label className="pl-2" htmlFor="formGroupExampleInput">EDUCATION</label>
                    {educational.education.length > 0 ? "" : <div className="text-danger text-left ml-2">You do not have any educational institutions added.</div>}
                    {educational.education.length > 0 ? 
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">INSTITUTION NAME</th>
                            <th scope="col">START YEAR</th>
                            <th scope="col">END YEAR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {educational.education.map((education, index) => (
                          <tr>
                            <th scope="row">{index+1}</th>
                            <td>{education['name']}</td>
                            <td>{education['startYear']}</td>
                            <td>{education['endYear']}</td>
                          </tr>
                          ))}
                        </tbody>
                      </table>
                    </div> : "" }
                    <div className="add-institution desktop-only">
                      <div className="form-group mt-2">
                        <input type="text" className="m-1 pl-3 form-control bg-white half-width d-inline-block" id="institution" onChange={this.onChange} placeholder="Enter your institution name" />
                        <input type="text" className="m-1 pl-3 form-control bg-white quarter-width d-inline-block" id="start" onChange={this.onChange} placeholder="Start year (YYYY)" />
                        <input type="text" className="m-1 pl-3 form-control bg-white quarter-width d-inline-block" id="end" onChange={this.onChange} placeholder="End year (YYYY)" />
                      </div>
                      <button className="float-right ml-5 btn rounded-pill btn-info" onClick={this.addInstitution}>ADD INSTITUTION ></button>
                    </div>
                  </div>
                  <div className="skills mt-5">
                    <label className="pl-2" htmlFor="formGroupExampleInput">SKILLS</label>
                    {educational.skills.length > 0 ? "" : <div className="text-danger text-left ml-2">You do not have any skills added.</div>}
                    <div className="tags ml-1">
                      {educational.skills.map(skill => (
                      <div className="tag mr-2 mt-2 px-3 py-1 bg-success text-white">{skill}</div>
                      ))}
                    </div> <br/>
                    <div className="add-institution desktop-only">
                      <button className="float-right ml-2 btn rounded-pill btn-info" onClick={this.addSkill}>ADD SKILL ></button>
                      {this.state.other ? <input type="text" className="float-right m-1 pl-3 form-control bg-white half-width d-inline-block" id="selectedSkill" onChange={this.onChange} placeholder="Enter new skill name" /> : ""}
                      <select className="float-right" onChange={this.handleSkillChange} id="skillDropDown">
                        {options.map(option => (
                          <option value={option.label}>{option.label}</option>
                        ))}
                          <option value="0">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="resume my-5">
                    <label className="pl-2" htmlFor="formGroupExampleInput">RESUME</label>
                    {educational.resume === ""  ? <div className="text-danger text-left ml-2">You have not uploaded your resume yet.</div> : <div className="text-success text-left ml-2">You have uploaded your resume.</div>}
                    <form onSubmit={this.handleResumeSubmit} encType='multipart/form-data'>
                      <input type="file" accept=".pdf" onChange={this.handleResume} className="m-1 form-control bg-white w-100 d-inline-block" id="text" placeholder="End year (YYYY)" />
                      <button className="mt-3 float-right ml-5 btn rounded-pill btn-info">{educational.resume === ""  ? "UPLOAD RESUME" : "UPDATE RESUME" } ></button>
                    </form>
                  </div>
                </div> 
                }
              </div>
            </div>
          </div>
          
        </div>
        

      </>
    );
  }
}

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getPersonalSettings: PropTypes.func.isRequired,
  getEducationalSettings: PropTypes.func.isRequired,
  updatePersonalSettings: PropTypes.func.isRequired,
  getSkills: PropTypes.func.isRequired,
  skills: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  job: state.job,
  auth: state.auth,
  personal: state.personal,
  educational: state.educational
});
export default connect(
  mapStateToProps,
  { getPersonalSettings, getEducationalSettings, updatePersonalSettings, getSkills, logoutUser }
)(Profile);