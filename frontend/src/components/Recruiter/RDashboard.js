import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faSortNumericUp, faSortNumericDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import Slider from '@material-ui/core/Slider';
import Swal from 'sweetalert2';
import Topbar from './Topbar.js';
import { getMyJobs } from './../../actions/jobAction.js';

class RDashboard extends Component {

  constructor() {
      super();
      this.state = {
        value: [0, 100000],
        jobs: [],
        displayjobs: [],
        firstCheck: 0,
        asc: 1,
        search: ""
      };
  }

  componentDidMount = () => {
    this.props.getMyJobs({"id": this.props.auth.user['id']});
  };

  sort_by_key = (array, key) => {
    var state_current = this;
    return array.sort(function(a, b){
      var x = a[key]; 
      var y = b[key];
      if(state_current.state.asc)
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      console.log(state_current.state.asc)
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

  onSubmit = e => {
    e.preventDefault();

    axios
      .post("/api/jobs/searchJobs", {"query": this.state.search})
      .then(res => {
        this.setState({
          displayjobs: res.data
        })
      })
      .catch(err => Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: JSON.stringify(err.response.data)
      }));

  };

  onChange = async e => {
    await this.setState({ [e.target.id]: e.target.value });
    axios
      .post("/api/jobs/searchJobs", {"query": this.state.search})
      .then(res => {
        this.setState({
          displayjobs: res.data
        })
      })
      .catch(err => Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: JSON.stringify(err.response.data)
      }));
  };

  jobCallback = (jobId) => {
    this.props.history.push('/recruiter/job/'+jobId)
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
                  {this.state.displayjobs.map(job_item => ( 
                  <div className="col-lg-4 my-2">
                    <div className="job-card p-3">
                      <div className="job-image"><img src={"../images/"+job_item['image']} alt="job"/></div>
                      <br/>
                      <div className="ellipsis">{job_item['rating'] === -1 ? "UNRATED" : job_item['rating']} &nbsp;<i><FontAwesomeIcon icon={faStar} color="#ffd500" /></i></div>
                      <div className="recruiter-name">{job_item['name']}</div>
                      <div className="job-header"><strong>{job_item['title']}</strong></div>
                      <div className="recruiter-name"><span style={{"color": "green"}}>Posted at: {job_item['posting']}</span></div>
                      <br/>
                      <p className="text-secondary">{job_item['description'].length < 125 ? job_item['description'] : job_item['description'].substring(0, 125) + "..."} </p>
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
              </div>
            </div>
          </div>
        </div>
        

      </>
    );
  }
}

RDashboard.propTypes = {
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
)(RDashboard);