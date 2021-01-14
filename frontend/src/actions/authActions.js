import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING, GET_PROFILE, GET_APPLICANT_PROFILE, GET_RECRUITER_PROFILE, UPDATE_PERSONAL_SETTINGS } from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/")) // re-direct to login on successful register
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      console.log("Decoded token", decoded)
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Personal Settings
export const getPersonalSettings = userData => dispatch => {
  axios
    .post("/api/users/getProfile", userData)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Educational Settings
export const getEducationalSettings = userData => dispatch => {
  axios
    .post("/api/users/getApplicantProfile", userData)
    .then(res =>
      dispatch({
        type: GET_APPLICANT_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Recruiter Settings
export const getRecruiterSettings = userData => dispatch => {
  axios
    .post("/api/users/getRecruiterProfile", userData)
    .then(res =>
      dispatch({
        type: GET_RECRUITER_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Update Personal Settings
export const updatePersonalSettings = userData => dispatch => {
  axios
    .post("/api/users/updatePersonal", userData)
    .then(res =>
      dispatch({
        type: UPDATE_PERSONAL_SETTINGS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// Set logged in user
export const setCurrentUser = decoded => {
  console.log("Setting user", decoded)
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};