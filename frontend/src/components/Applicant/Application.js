import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faSortNumericUp, faSortNumericDown, faSearch, faHeart, faShareAlt } from '@fortawesome/free-solid-svg-icons'
import Slider from '@material-ui/core/Slider';
import Swal from 'sweetalert2';
import Topbar from './Topbar.js';
import { getMyApplications } from './../../actions/jobAction.js';
import StarRatings from 'react-star-ratings';

class Application extends Component {

  constructor() {
      super();
      this.state = {
        firstCheck: 0,
        displayApplications: [],
        applications: [],
        display: {},
        rating: 0
      };
  }

  componentDidMount = () => {
    this.props.getMyApplications({"id": this.props.auth.user.id});

    var state_current = this;

    axios
      .post("/api/jobs/viewApplication", {"id": this.props.match.params.id})
      .then(res => {
         console.log(res.data);
         state_current.setState({
          display: res.data
        })
      });

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

  changeRating = ( newRating, name ) => {
    this.setState({
      rating: newRating
    });
  };

  submitRating = (jobId) => {
    axios
      .post("/api/applicant/changeJobRating", {"id": this.props.auth.user.id, "rating": this.state.rating, "jobId": jobId})
      .then(async () => {
        Swal.fire('Added Rating!', '', 'success')
      });
  };

  dashboardCallback = () => {
    this.props.history.push('/dashboard')
  };

  applicationViewCallback = async (id) => {
    await this.props.history.push('/application/'+id);
    window.location.reload(false);
  }

  render() {

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
          <br/><br/>
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
                <div className="row">
                  <div className="col-lg-4 my-2 desktop-only job-list-scroll">
                    {this.state.displayApplications.map(application_item => ( 
                    <div className="col-lg-12 my-2">
                      <div className="job-card p-3">
                        <div className="job-image"><img src={"../../images/"+application_item['job']['image']}/></div>
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
                  <div className="col-lg-8 my-2 job-list-scroll">
                    <div className="job-detailed-card my-2">
                      <div className="timeline">
                        <div className="timeline-cover">
                          <img src="../../images/cover.jpg" alt="job"/>
                        </div>
                        <div className="timeline-profile-picture">
                          <img src={"../../images/"+(this.state.display.job ? this.state.display.job.image : "")} alt="job"/>
                        </div>
                      </div>
                      <div className="job-detailed-content p-5">
                        <div className="float-left job-detailed-header">{this.state.display.job ? this.state.display.job.title : ""}</div>
                        <div className="desktop-only text-right"><i className="detailed-icon mx-2"><FontAwesomeIcon icon={faHeart} color="tomato" size="2x" /></i></div>
                        <div className="mt-2 text-info"><span className="job-detailed-recruiter">{this.state.display.job ? this.state.display.job.name : ""}</span> <span className="text-secondary">• {this.state.display.job ? this.state.display.job.email : ""}</span></div>
                        <div className="text-right text-secondary">{this.state.display.job ? this.state.display.job.posting : ""} <strong> • {this.state.display.job ? this.state.display.job.currApplications : ""} applicants </strong></div>

                        <div className="mt-5 table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th scope="col" className="text-center">DURATION</th>
                                <th scope="col" className="text-center">MAX NO. OF APPLICATIONS</th>
                                <th scope="col" className="text-center">MAX NO. OF POSITIONS</th>
                                <th scope="col" className="text-center">OFFERED SALARY</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-center">{this.state.display.job ? this.state.display.job.duration : ""} Months</td>
                                <td className="text-center">{this.state.display.job ? this.state.display.job.applications : ""}</td>
                                <td className="text-center">{this.state.display.job ? this.state.display.job.positions : ""}</td>
                                <td className="text-center">₹ {this.state.display.job ? this.state.display.job.salary : ""} / Month</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <h5 className="mt-3"><strong>Overview</strong></h5>
                        <p className="text-secondary">{this.state.display.job ? this.state.display.job.description : ""}</p>
                      
                        <h5 className="mt-3"><strong>Job Description</strong></h5>
                        <ul className="arrow">
                          <li>The job requires a dedication of {this.state.display.job ? this.state.display.job.duration : ""} months</li>
                          <li>Deadline for application: {this.state.display.job ? this.state.display.job.deadline : ""}</li>
                          <li>Applicants are required to know the following skills: <br/>
                            {this.state.display.job && this.state.display.job.skillset.map(skill => (
                              <div className="tag mr-2 mt-2 px-3 py-1 bg-success text-white">{skill}</div>
                            ))}
                          </li>
                          <li>{this.state.display.job ? this.state.display.job.jobType === 0 ? "This is a full time job" : this.state.display.job.jobType === 1 ? "This is a part time job" : "This is a work-from-home job." : ""}</li>
                        </ul>

                        <h5 className="mt-3 text-primary"><strong>Statement of Purpose</strong></h5>
                        <p className="text-secondary">{this.state.display.application ? this.state.display.application.sop : ""}</p>

                        <h5 className="mt-3 text-primary"><strong>Application Status</strong></h5>
                        <p className="text-secondary">
                          {this.state.display.application ? this.state.display.application.status === 0 ? "Pending" : "" : ""}
                          {this.state.display.application ? this.state.display.application.status === 1 ? "Shortlisted" : "" : ""}
                          {this.state.display.application ? this.state.display.application.status === 2 ? "Accepted" : "" : ""}
                          {this.state.display.application ? this.state.display.application.status === 3 ? "Rejected" : "" : ""}
                          {this.state.display.application ? this.state.display.application.status === 4 ? "Depriciated" : "" : ""}
                        </p>

                        {this.state.display.application ? this.state.display.application.status === 2 && !this.state.display['hasRated'] ? 
                          <div>
                            <h5 className="mt-3 text-info"><strong>Rate this job</strong></h5>
                            <StarRatings
                              rating={this.state.rating}
                              starRatedColor="blue"
                              changeRating={this.changeRating}
                              numberOfStars={5}
                              name='rating'
                            />
                            <button className="btn float-right btn-info rounded-pill" onClick={() => this.submitRating(this.state.display ? this.state.display.job['_id'] : "")}>SUBMIT RATING > </button>
                          </div> : 
                          this.state.display.application.status === 2 ? <div className="text-info">You have already rated this employee.</div> : "" : ""
                        }
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

Application.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getMyApplications: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  job: state.job,
});
export default connect(
  mapStateToProps,
  { getMyApplications, logoutUser }
)(Application);