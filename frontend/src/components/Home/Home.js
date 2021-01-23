import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import Swal from 'sweetalert2';

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

								<button className="loginBtn loginBtn--google pl-5 my-1">
								  Login with Google
								</button>
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
