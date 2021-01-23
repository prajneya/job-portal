import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import Swal from 'sweetalert2';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

class Register extends Component {

	constructor() {
	    super();
	    this.state = {
	      name: "",
	      email: "",
	      password: "",
	      password2: "",
	      userType: 0,
	      errors: {}
	    };
	  }

	componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {	
      Swal.fire({
			  icon: 'error',
			  title: 'Oops...',
			  text: 'Something went wrong!',
			  footer: JSON.stringify(nextProps.errors)
			})
      this.setState({
        errors: nextProps.errors
      });
    }
  }

	onChange = e => {
	    this.setState({ [e.target.id]: e.target.value });
	};

	setUserType = e => {
		this.setState({
			userType: e.target.value
		});
	};

	onSubmit = e => {
	    e.preventDefault();
		const newUser = {
	      name: this.state.name,
	      email: this.state.email,
	      password: this.state.password,
	      password2: this.state.password2,
	      userType: this.state.userType
	    };

		this.props.registerUser(newUser, this.props.history); 
	};

	render() {

		const { errors } = this.state;

		return (
			<>
				<div className="row no-gutters">
					<div className="col-lg-8 col-md-6 tablet-only login-bg">
					</div>
					<div className="col-lg-4 col-md-6 login-info">
						<div className="register-container mx-5">
							<h1>Register</h1>
							<form className="mt-5 mb-2" onSubmit={this.onSubmit} autoComplete="off">
							  <div className="form-group">
						        <label htmlFor="formGroupExampleInput">Full Name</label>
						        <input type="text" className="form-control" id="name" placeholder="Enter your full name" onChange={this.onChange} value={this.state.name} error={errors.name} required/>
						      </div>
						      <div className="form-group">
						        <label htmlFor="formGroupExampleInput">E-mail</label>
						        <input type="email" className="form-control" id="email" placeholder="Enter your email address" onChange={this.onChange} value={this.state.email} error={errors.email} required/>
						      </div>
						      <div className="form-group">
						        <label htmlFor="formGroupExampleInput2">Password</label>
						        <input type="password" className="form-control" id="password" placeholder="Enter your password" onChange={this.onChange} value={this.state.password} error={errors.password} required/>
						      </div>
						      <div className="form-group">
						        <label htmlFor="formGroupExampleInput2">Confirm Password</label>
						        <input type="password" className="form-control" id="password2" placeholder="Repeat the above password" onChange={this.onChange} value={this.state.password2} error={errors.password2} required/>
						      </div>
						      <div className="form-group">
						        <label htmlFor="formGroupExampleInput2">Who are you?</label>
								<select className="form-control" onChange={this.setUserType}>
								  <option value="0">Job Applicant</option>
								  <option value="1">Job Recruiter</option>
								</select>
						      </div>
						      <button type="submit" className="btn btn-primary w-100 my-2 py-3 getin-button">Sign Up</button>
						    </form>   
						    <div className="text-center text-secondary"> or easy register with</div>
						    <div className="text-center my-3">

								<button className="loginBtn loginBtn--google pl-5 my-1">
								  Register with Google
								</button>
							</div>
							<div className="text-center text-secondary my-5">Already have an account? <a href="/"><span className="text-primary">Sign in here.</span></a></div>
						</div>
					</div>
				</div>
			</>

		)
	}
}


Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
