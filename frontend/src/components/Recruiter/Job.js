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
import { getMyJobs } from './../../actions/jobAction.js';

class Job extends Component {

  constructor() {
      super();
      this.state = {
        value: [0, 100000],
        jobs: [],
        displayjobs: [],
        firstCheck: 0,
        asc: 1,
        appAsc: 1,
        search: "",
        display: {}
      };
  }

  componentDidMount = () => {
    this.props.getMyJobs({"id": this.props.auth.user['id']});

    var state_current = this;

    axios
      .post("/api/jobs/viewJob", {"id": this.props.match.params.id})
      .then(res => {
         console.log(res.data);
         state_current.setState({
          display: res.data
        })
      });

  };

  sort_by_key = (array, key) => {
    var state_current = this;
    return array.sort(function(a, b){
      var x = a[key]; 
      var y = b[key];
      if(state_current.state.asc)
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  };

  applications_sort_by_key = (array, key) => {
    var state_current = this;
    return array.sort(function(a, b){
      if(key==="name"){
        var x = a['applicant'][key]; 
        var y = b['applicant'][key];
      }
      else if(key==="createdAt"){
        var x = a['application'][key]; 
        var y = b['application'][key];
      }
      else{
        var x = a['applicantDets']['rating']/a['applicantDets']['ratedBy'].length; 
        var y = b['applicantDets']['rating']/b['applicantDets']['ratedBy'].length;
      }
      if(state_current.state.appAsc)
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  };

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  
  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
      displayjobs: this.state.jobs.filter(item => (item['salary'] >= newValue[0] && item['salary'] <= newValue[1]))
    });
  };

  createJobCallback = () => {
    this.props.history.push('/recruiter/create')
  };

  filterJobType = () => {
    console.log(this.state.jobs)
    var ft = document.getElementById("fulltime");
    var pt = document.getElementById("parttime");
    var wfh = document.getElementById("wfh");

    if(ft.checked){
      this.setState({
          displayjobs: this.state.jobs.filter(item => (item['jobType'] === 0))
      })
    }

    if(pt.checked){
      this.setState({
          displayjobs: this.state.jobs.filter(item => (item['jobType'] === 1))
      })
    }

    if(wfh.checked){
      this.setState({
          displayjobs: this.state.jobs.filter(item => (item['jobType'] === 2))
      })
    }

    if(ft.checked && pt.checked){
      this.setState({
          displayjobs: this.state.jobs.filter(item => (item['jobType'] === 0 || item['jobType'] === 1 ))
      })
    }

    if(ft.checked && wfh.checked){
      this.setState({
          displayjobs: this.state.jobs.filter(item => (item['jobType'] === 0 || item['jobType'] === 1 ))
      })
    }

    if(pt.checked && wfh.checked){
      this.setState({
          displayjobs: this.state.jobs.filter(item => (item['jobType'] === 1 || item['jobType'] === 2 ))
      })
    }

    if(ft.checked && pt.checked && wfh.checked){
      this.setState({
          displayjobs: this.state.jobs
      })
    }

    if(!ft.checked && !pt.checked && !wfh.checked){
      this.setState({
          displayjobs: []
      })
    }

  };

  filterDuration = () => {
    this.setState({
      displayjobs: this.state.jobs.filter(item => (item['duration'] <= document.getElementById("filterBy").value)),
    })
  };

  filterSort = () => {
    var sortkey = document.getElementById("sortBy").value;
    this.setState({
      displayjobs: this.sort_by_key(this.state.displayjobs, sortkey)
    })
  };

  filterApplicationSort = () => {
    var sortkey = document.getElementById("sortApplicationsBy").value;

    var temp_display = this.state.display;
    temp_display['applications'] = this.applications_sort_by_key(this.state.display.applications, sortkey)

    this.setState({
      display: temp_display
    })

  };

  ascendingSort = async () => {
    if(this.state.asc===1){
      return;
    }
    await this.setState({
      asc: 1
    });
    this.filterSort();
  };

  descendingSort = async () => {
    if(this.state.asc===0){
      return;
    }
    await this.setState({
      asc: 0
    });
    this.filterSort();
  };

  ascendingAppSort = async () => {
    if(this.state.appAsc===1){
      return;
    }
    await this.setState({
      appAsc: 1
    });
    this.filterApplicationSort();
  };

  descendingAppSort = async () => {
    if(this.state.appAsc===0){
      return;
    }
    await this.setState({
      appAsc: 0
    });
    this.filterApplicationSort();
  };

  onSubmit = e => {
    e.preventDefault();

    axios
      .post("/api/jobs/searchJobs", {"query": this.state.search})
      .then(res => {
        this.setState({
          displayjobs: res.data
        })
      });

  };

  onChange = async e => {
    await this.setState({ [e.target.id]: e.target.value });
    axios
      .post("/api/jobs/searchJobs", {"query": this.state.search})
      .then(res => {
        this.setState({
          displayjobs: res.data
        })
      });
  };

  jobCallback = (jobId) => {
    this.props.history.push('/recruiter/job/'+jobId);
    window.location.reload(false);
  };

  viewApplication = (user, application, applicant) => {

    var skills_string = applicant['skills'].toString();

    if(application['status']===0){
      Swal.fire({
        title: user['name']+' - Application',
        didOpen: () => {
          var tableData = document.getElementById("table__body");
          var len = applicant['education'].length;
          for(var i = 0; i<len; i++){
            var tr = document.createElement('tr');

            var td = document.createElement('td');
            td.innerHTML = i+1;
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerHTML = applicant['education'][i]['name'];
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerHTML = applicant['education'][i]['startYear'];
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerHTML = applicant['education'][i]['endYear'];
            tr.appendChild(td);

            tableData.appendChild(tr);
          }
        },  
        html: `<label>NAME</label>
              <p>${user['name']}</p>
              <label>DATE OF APPLICATION</label>
              <p>${application['createdAt']}</p>
              <label>SOP</label>
              <p>${application['sop']}</p>
              <label>EDUCATION</label>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">INSTITUTION NAME</th>
                      <th scope="col">START YEAR</th>
                      <th scope="col">END YEAR</th>
                    </tr>
                  </thead>
                  <tbody id="table__body">
                  </tbody>
                </table>
              </div>
              <label>SKILLS</label>
              <p>${skills_string}</p>
              <label>RATING</label>
              <p>${applicant['rating']==-1 ? "UNRATED" : applicant['rating']/applicant['ratedBy'].length}</p>
              <label>STAGE OF APPLICATION</label>
              <p>Pending</p>
              <label>RESUME</label>
              <p><a href=${applicant['resume']=="" ? "" : "../../resume/"+applicant['resume']}>${applicant['resume']=="" ? "NO RESUME" : "DOWNLOAD"}</a></p>
              `,
        showCancelButton: true,
        showDenyButton: true,
        denyButtonColor: 'grey',
        denyButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#8b0000',
        confirmButtonText: 'Shortlist',
        cancelButtonText: 'Reject',
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          content: 'text-left',
        }
      }).then((result) => {
        if(result.isConfirmed){
          axios
            .post("/api/applicant/changeApplicationStatus", {"change": "shortlist", "id": application['_id']})
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Shortlisted',
                text: 'The application is shortlisted!',
              })
            });
        }
        else if(result.isDismissed){
          axios
            .post("/api/applicant/changeApplicationStatus", {"change": "reject", "id": application['_id']})
            .then(() => {
              Swal.fire({
                icon: 'error',
                title: 'Rejected',
                text: 'The application is rejected!',
              })
            });
        }
      })
    }
    else{
      if(application['status']===1){
      Swal.fire({
        title: user['name']+' - Application',
        didOpen: () => {
          var tableData = document.getElementById("table__body");
          var len = applicant['education'].length;
          for(var i = 0; i<len; i++){
            var tr = document.createElement('tr');

            var td = document.createElement('td');
            td.innerHTML = i+1;
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerHTML = applicant['education'][i]['name'];
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerHTML = applicant['education'][i]['startYear'];
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerHTML = applicant['education'][i]['endYear'];
            tr.appendChild(td);

            tableData.appendChild(tr);
          }
        },  
        html: `<label>NAME</label>
              <p>${user['name']}</p>
              <label>DATE OF APPLICATION</label>
              <p>${application['createdAt']}</p>
              <label>SOP</label>
              <p>${application['sop']}</p>
              <label>EDUCATION</label>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">INSTITUTION NAME</th>
                      <th scope="col">START YEAR</th>
                      <th scope="col">END YEAR</th>
                    </tr>
                  </thead>
                  <tbody id="table__body">
                  </tbody>
                </table>
              </div>
              <label>SKILLS</label>
              <p>${skills_string}</p>
              <label>RATING</label>
              <p>${applicant['rating']==-1 ? "UNRATED" : applicant['rating']/applicant['ratedBy'].length}</p>
              <label>STAGE OF APPLICATION</label>
              <p>Shortlisted</p>
              <label>RESUME</label>
              <p><a href=${"../../resume/"+applicant['resume']}>DOWNLOAD</a></p>
              `,
        showCancelButton: true,
        showDenyButton: true,
        denyButtonColor: 'grey',
        denyButtonText: 'Cancel',
        confirmButtonColor: '#4bb543',
        cancelButtonColor: '#8b0000',
        confirmButtonText: 'Accept',
        cancelButtonText: 'Reject',
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          content: 'text-left',
        }
      }).then((result) => {
        if(result.isConfirmed){
          axios
            .post("/api/applicant/changeApplicationStatus", {"change": "accept", "id": application['_id']})
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Accepted',
                text: 'The application is accepted!',
              })
            });
        }
        else if(result.isDismissed){
          axios
            .post("/api/applicant/changeApplicationStatus", {"change": "reject", "id": application['_id']})
            .then(() => {
              Swal.fire({
                icon: 'error',
                title: 'Rejected',
                text: 'The application is rejected!',
              })
            });
        }
      })
    }
    }
  };

  editJobCallback = (jobId) => {
    this.props.history.push('/recruiter/editJob/'+jobId)
  };

  deleteJobCallback = async (jobId) => {
    await Swal.fire({
      icon: 'error',
      title: 'Are you sure you want to delete this Job Listing?',
      footer: 'This action cannot be undone',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("/api/jobs/delete", {"id": jobId})
          .then(async () => {
            Swal.fire('Deleted Job Listing!', '', 'success')
          });
      } else if (result.isDenied) {
        Swal.fire('Job Listing not deleted!', '', 'info')
      }
    })
  };


  render() {

    if(this.state.firstCheck===0 && this.props.job.job.length > 0){
      this.setState({
        jobs: this.props.job.job,
        displayjobs: this.props.job.job,
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
                <label><span style={{"color": "black"}}>Create a Job Listing</span></label>
                <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                <button className="btn btn-primary" onClick={this.createJobCallback}>Create Job Listing > </button>
              </div>
              <div className="filter-header mt-3 mx-2">
                <label>Type of Employment</label>
                <div className="checkbox checkbox-primary mt-2" onClick={this.filterJobType}>
                  <input id="fulltime" type="checkbox" name="jobType" defaultChecked/>
                  <label htmlFor="fulltime" className="filter-label text-secondary">Full-Time</label>
                </div>
                <div className="checkbox checkbox-primary" onClick={this.filterJobType}>
                  <input id="parttime" type="checkbox" name="jobType" defaultChecked/>
                  <label htmlFor="parttime" className="filter-label text-secondary">Part-Time</label>
                </div>
                <div className="checkbox checkbox-primary" onClick={this.filterJobType}>
                  <input id="wfh" type="checkbox" name="jobType" defaultChecked/>
                  <label htmlFor="wfh" className="filter-label text-secondary">Work From Home</label>
                </div>
              </div>
              <div className="filter-header mt-3 mx-2">
                <label>Salary Range</label>
                <Slider
                  value={this.state.value}
                  onChange={this.handleChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  min={0}
                  max={100000}
                />
              </div>
              <div className="filter-header mt-3 mx-2">
                <label>Duration</label> &nbsp; &nbsp;
                <select className="sort-select" id="filterBy" onChange={this.filterDuration} defaultValue="6">
                  <option value="0">1 Month</option>
                  <option value="1">2 Months</option>
                  <option value="2">3 Months</option>
                  <option value="3">4 Months</option>
                  <option value="4">5 Months</option>
                  <option value="5">6 Months</option>
                  <option value="6">7 Months</option>
                </select>
              </div>
            </div>
            <div className="col-lg-10">
              <h4 className="jobs-header">Showing {this.state.displayjobs.length} Active Job Listings</h4>
              <div className="float-right tablet-only">
                <span className="sort-icon" onClick={this.descendingSort}><i><FontAwesomeIcon icon={faSortNumericUp} color={this.state.asc===0 ? "tomato" : ""}/></i></span> &nbsp;
                <span className="sort-icon" onClick={this.ascendingSort}><i><FontAwesomeIcon icon={faSortNumericDown} color={this.state.asc===1 ? "tomato" : ""} /></i></span> &nbsp;
                 Sort By: &nbsp;
                <select className="sort-select" id="sortBy" onChange={this.filterSort}>
                  <option value="posting">Select</option>
                  <option value="salary">Salary</option>
                  <option value="duration">Duration</option>
                  <option value="rating">Rating</option>
                </select>
              </div> 
              <div className="jobs-listing mt-5">
                <div className="row">
                  <div className="col-lg-4 my-2 desktop-only job-list-scroll">
                    {this.state.displayjobs.map(job_item => ( 
                    <div className="col-lg-12 my-2">
                      <div className="job-card p-3">
                        <div className="job-image"><img src={"../../images/"+job_item['image']} alt="job"/></div>
                        <br/>
                        <div className="ellipsis">{job_item['rating'] === -1 ? "UNRATED" : job_item['rating']} &nbsp;<i><FontAwesomeIcon icon={faStar} color="#ffd500" /></i></div>
                        <div className="recruiter-name">{job_item['name']}</div>
                        <div className="job-header"><strong>{job_item['title']}</strong></div>
                        <div className="recruiter-name"><span style={{"color": "green"}}>Posted at: {job_item['posting']}</span></div>
                        <br/>
                        <p className="text-secondary">{job_item['description'].length < 125 ? job_item['description'] : job_item['description'].substring(0, 125) + "..."}</p>
                        <div className="tags">
                          <div className="tag mr-2 mt-2 px-3 py-1">{job_item['currApplications']} Applicants</div>
                          <div className="tag mr-2 mt-2 px-3 py-1">{job_item['positions']} Positions</div>
                        </div>
                        <div className="action-buttons mt-4">
                          <div className="row">
                            <div className="col-md-4 mt-2">
                              <button className="btn btn-info py-2 px-3 w-100 d-inline-block" onClick={() => this.editJobCallback(job_item['_id'])}>Edit</button>
                            </div>
                            <div className="col-md-4 mt-2">
                              <button className="btn btn-danger py-2 px-3 w-100 d-inline-block" onClick={() => this.deleteJobCallback(job_item['_id'])}>Delete</button>
                            </div>
                            <div className="col-md-4 mt-2">
                              <button className="btn light-button py-2 px-3 w-100 d-inline-block" onClick={() => this.jobCallback(job_item['_id'])}>View More</button>
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

                        <h5 className="mt-3"><strong>Current Applicants</strong></h5>
                        {this.state.display.job ? this.state.display.job.currApplications ?
                        <div>
                          <div className="float-right tablet-only">
                            <span className="sort-icon" onClick={this.descendingAppSort}><i><FontAwesomeIcon icon={faSortNumericUp} color={this.state.appAsc===0 ? "tomato" : ""}/></i></span> &nbsp;
                            <span className="sort-icon" onClick={this.ascendingAppSort}><i><FontAwesomeIcon icon={faSortNumericDown} color={this.state.appAsc===1 ? "tomato" : ""} /></i></span> &nbsp;
                             Sort By: &nbsp;
                            <select className="sort-select" onChange={this.filterApplicationSort} id="sortApplicationsBy">
                              <option value="starter">Select</option>
                              <option value="name">Name</option>
                              <option value="createdAt">Date</option>
                              <option value="rating">Rating</option>
                            </select>
                          </div> 
                          <div className="mt-5 table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th scope="col" className="text-center">#</th>
                                  <th scope="col" className="text-center">NAME</th>
                                  <th scope="col" className="text-center">DATE OF APPLICATION</th>
                                  <th scope="col" className="text-center">RATING</th>
                                  <th scope="col" className="text-center">DETAILS</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.display.applications && this.state.display.applications.map((application, index) => (
                                <tr>
                                  <th scope="row" className="text-center pt-3">{index+1}</th>
                                  <td className="text-center pt-3">{application['applicant']['name']}</td>
                                  <td className="text-center pt-3">{application['application']['createdAt']}</td>
                                  <td className="text-center pt-3">{application['applicantDets']['rating'] == -1 ? "UNRATED" : application['applicantDets']['rating']}</td>
                                  <td className="text-center"><button className="btn btn-info" onClick={() => this.viewApplication(application['applicant'], application['application'], application['applicantDets'])}>VIEW APPLICATION</button></td>
                                </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        : <div className="text-danger">There are no applicants for this job currently. Please check back later.</div> : "" }
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

Job.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getMyJobs: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  job: state.job,
});
export default connect(
  mapStateToProps,
  { getMyJobs, logoutUser }
)(Job);