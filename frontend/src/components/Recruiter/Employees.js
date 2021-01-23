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
import { getMyEmployees } from './../../actions/jobAction.js';
import StarRatings from 'react-star-ratings';

class Employees extends Component {

  constructor() {
      super();
      this.state = {
        value: [0, 100000],
        jobs: [],
        displayjobs: [],
        firstCheck: 0,
        asc: 1,
        search: "",
        rating: 2.5
      };
  }

  componentDidMount = () => {
    this.props.getMyEmployees({"id": this.props.auth.user['id']});
  };

  sort_by_key = (array, key) => {
    var state_current = this;
    return array.sort(function(a, b){
      if(key==="name"){

        var x = a['applicant'][key]; 
        var y = b['applicant'][key];
      }
      else if(key==="title"){
        
        var x = a['job'][key]; 
        var y = b['job'][key];
      }
      else if(key==="lastUpdated"){
        
        var x = a['application'][key]; 
        var y = b['application'][key];
      }
      else{
        var x = a['applicantDets']['rating']/a['applicantDets']['ratedBy'].length; 
        var y = b['applicantDets']['rating']/b['applicantDets']['ratedBy'].length;
      }
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

  changeRating = ( newRating, name ) => {
    this.setState({
      rating: newRating
    });
  };

  submitRating = (jobId, id) => {
    axios
      .post("/api/applicant/changeRating", {"id": id, "rating": this.state.rating, "jobId": jobId})
      .then(async () => {
        Swal.fire('Added Rating!', '', 'success')
      })
      .catch(err => Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: JSON.stringify(err.response.data)
      }));
  }

  render() {

    if(this.state.firstCheck===0 && this.props.job.employees.length > 0){
      this.setState({
        jobs: this.props.job.employees,
        displayjobs: this.props.job.employees,
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
            </div>
            <div className="col-lg-10">
              <h4 className="jobs-header">Showing {this.state.displayjobs.length} Employees</h4>
              <div className="float-right tablet-only">
                <span className="sort-icon" onClick={this.descendingSort}><i><FontAwesomeIcon icon={faSortNumericUp} color={this.state.asc===0 ? "tomato" : ""}/></i></span> &nbsp;
                <span className="sort-icon" onClick={this.ascendingSort}><i><FontAwesomeIcon icon={faSortNumericDown} color={this.state.asc===1 ? "tomato" : ""} /></i></span> &nbsp;
                 Sort By: &nbsp;
                <select className="sort-select" id="sortBy" onChange={this.filterSort}>
                  <option value="select">Select</option>
                  <option value="name">Name</option>
                  <option value="title">Job Title</option>
                  <option value="lastUpdated">Date of Joining</option>
                  <option value="rating">Rating</option>
                </select>
              </div> 
              <div className="jobs-listing mt-5">
                <div className="row">
                  {this.state.displayjobs.map(job_item => ( 
                  <div className="col-lg-4 my-2">
                    <div className="job-card p-3">
                      <div className="job-image"><img src={"../images/profilepics/"+job_item['applicantDets']['profilePic']} alt="job"/></div>
                      <br/>
                      <div className="ellipsis">{job_item['applicantDets']['rating'] === -1 ? "UNRATED" : job_item['applicantDets']['rating']/job_item['applicantDets']['ratedBy'].length} &nbsp;<i><FontAwesomeIcon icon={faStar} color="#ffd500" /></i></div>
                      <div className="recruiter-name">{job_item['job']['title']}</div>
                      <div className="job-header"><strong>{job_item['applicant']['name']}</strong></div>
                      <div className="recruiter-name"><span style={{"color": "green"}}>Date of Joining: {job_item['application']['lastUpdated']}</span></div>
                      <br/>
                      <div className="tags">
                        {job_item['job']['jobType'] === 0 ? <div className="tag mr-2 mt-2 px-3 py-1">Full Time Employee</div> : "" }
                        {job_item['job']['jobType'] === 1 ? <div className="tag mr-2 mt-2 px-3 py-1">Part Time Employee</div> : "" }
                        {job_item['job']['jobType'] === 2 ? <div className="tag mr-2 mt-2 px-3 py-1">Work from Home Employee</div> : "" }
                      </div> <br/>
                      {job_item['hasRated'] ? <div className="text-info">You have already rated this employer.</div> :
                      <div>
                      <StarRatings
                        rating={this.state.rating}
                        starRatedColor="blue"
                        changeRating={this.changeRating}
                        numberOfStars={5}
                        name='rating'
                      />
                      <button className="btn float-right btn-info rounded-pill" onClick={() => this.submitRating(job_item['job']['_id'], job_item['applicant']['_id'])}>SUBMIT RATING > </button>
                      </div>
                      }
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

Employees.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getMyEmployees: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  job: state.job,
});
export default connect(
  mapStateToProps,
  { getMyEmployees, logoutUser }
)(Employees);