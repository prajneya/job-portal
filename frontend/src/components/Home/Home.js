import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import Swal from 'sweetalert2';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

class Home extends Component {

	constructor() {
	    super();
	    this.state = {
	      email: "",
	      password: "",
	      errors: {}
	    };
	}

	componentWillReceiveProps(nextProps) {
	    if (nextProps.auth.isAuthenticated) {
	      if(nextProps.auth.user.userType===0)
	      	this.props.history.push("/dashboard"); // push user to applicant dashboard when they login
	      else if(nextProps.auth.user.userType===1)
	      	this.props.history.push("/recruiter/dashboard"); // push user to recruiter dashboard when they login
	    }
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

	onSubmit = e => {
	    e.preventDefault();
		const userData = {
	      email: this.state.email,
	      password: this.state.password
	    };
		
		this.props.loginUser(userData);
	};

	responseSuccessApplicantGoogle = async (response) => {
	  console.log(response);

	  await axios.post('api/users/googleSignIn', {name: response.profileObj.name, email: response.profileObj.email, userType: 0})
	  		.then(res => {
	  			if(res.data['success']){
	  				const { token } = res.data;
			     	localStorage.setItem("jwtToken", token);
			      	setAuthToken(token);
			      	const decoded = jwt_decode(token);
			      	console.log("Decoded token", decoded)
					this.props.history.push("/dashboard")
	  			}
	  		})
	  		.catch(err => Swal.fire({
			  icon: 'error',
			  title: 'Oops...',
			  text: 'Something went wrong!',
			  footer: JSON.stringify(err)
			}));
		window.location.reload(false);
	};

	responseSuccessRecruiterGoogle = async (response) => {
	  console.log(response);
	  await axios.post('api/users/googleSignIn', {name: response.profileObj.name, email: response.profileObj.email, userType: 1})
	  		.then(res => {
	  			if(res.data['success']){
	  				const { token } = res.data;
			     	localStorage.setItem("jwtToken", token);
			      	setAuthToken(token);
			      	const decoded = jwt_decode(token);
			      	console.log("Decoded token", decoded)
					this.props.history.push("/recruiter/dashboard")
	  			}
	  		})
	  		.catch(err => Swal.fire({
			  icon: 'error',
			  title: 'Oops...',
			  text: 'Something went wrong!',
			  footer: JSON.stringify(err)
			}));
		window.location.reload(false);
	};

	responseFailureGoogle = (response) => {
	  console.log("FAILURE", response);
	}

	render() {

		const { errors } = this.state;

		return (
			<>
				<div className="row no-gutters">
					<div className="col-lg-8 col-md-6 tablet-only login-bg">
					</div>
					<div className="col-lg-4 col-md-6 login-info">
						<div className="login-container mx-5">
							<h1>Login</h1>
							<form className="mt-5 mb-2" noValidate onSubmit={this.onSubmit}>
						      <div className="form-group">
						        <label htmlFor="formGroupExampleInput">E-mail</label>
						        <input type="email" className="rounded-pill form-control" id="email" placeholder="Enter your registered email address" onChange={this.onChange} value={this.state.email} error={errors.email} />
						      </div>
						      <div className="form-group">
						        <label htmlFor="formGroupExampleInput2">Password</label>
						        <input type="password" className="rounded-pill form-control" id="password" placeholder="Enter your password" onChange={this.onChange} value={this.state.password} error={errors.password} />
						      </div>
						      <button type="submit" className="btn btn-primary w-100 my-2 py-3 getin-button">Sign In</button>
						    </form>   
						    <div className="text-center text-secondary"> or easy login with</div>
						    <div className="text-center my-3">
								<GoogleLogin
								    clientId="277600011274-f18q9tvl6gdct1fdk1dfuumc4mkbmrdp.apps.googleusercontent.com"
								    buttonText="Login with Google as Applicant "
								    onSuccess={this.responseSuccessApplicantGoogle}
								    onFailure={this.responseFailureGoogle}
								    cookiePolicy={'single_host_origin'}
								/> &nbsp;
								<GoogleLogin
								    clientId="277600011274-f18q9tvl6gdct1fdk1dfuumc4mkbmrdp.apps.googleusercontent.com"
								    buttonText="Login with Google as Recruiter "
								    onSuccess={this.responseSuccessRecruiterGoogle}
								    onFailure={this.responseFailureGoogle}
								    cookiePolicy={'single_host_origin'}
								/>
							</div>
							<div className="text-center text-secondary my-5">Don't have an account yet? <a href="/register"><span className="text-primary">Create an account.</span></a></div>
						</div>
					</div>
				</div>
			</>

		)
	}
}

Home.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { loginUser }
)(Home);
