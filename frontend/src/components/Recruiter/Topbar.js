import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

class Topbar extends Component {

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;

    return (
      <>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/recruiter/dashboard">Recruiter Profile</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto px-3">
              <Nav.Link href="/recruiter/dashboard">Dashboard</Nav.Link>
              <NavDropdown title={user.name} id="dropdown-menu-align-right">
                <NavDropdown.Item href="/recruiter/profile">Profile Settings</NavDropdown.Item>
                <NavDropdown.Item href="/recruiter/create">Create Job Listing</NavDropdown.Item>
                <NavDropdown.Item href="/recruiter/employees">My Employees</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={this.onLogoutClick}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
}

Topbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Topbar);