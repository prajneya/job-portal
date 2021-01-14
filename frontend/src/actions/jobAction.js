import axios from "axios";
import { GET_ERRORS, GET_JOBS, GET_SKILLS, JOBS_LOADING } from "./types";

// Get All Jobs
export const getJobs = () => dispatch => {
  dispatch(setJobsLoading());
  axios
    .get("/api/jobs/getAll")
    .then(res =>
      dispatch({
        type: GET_JOBS,
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

// Get All Skills
export const getSkills = () => dispatch => {
  dispatch(setJobsLoading());
  axios
    .get("/api/jobs/getSkills")
    .then(res =>
      dispatch({
        type: GET_SKILLS,
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

// Jobs loading
export const setJobsLoading = () => {
  return {
    type: JOBS_LOADING
  };
};