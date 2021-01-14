import axios from "axios";
import { GET_ERRORS, GET_JOBS, JOBS_LOADING } from "./types";

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

// Jobs loading
export const setJobsLoading = () => {
  return {
    type: JOBS_LOADING
  };
};