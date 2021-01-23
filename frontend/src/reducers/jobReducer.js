import { GET_JOBS, GET_RECRUITER_JOBS, GET_RECRUITER_EMPLOYEES, GET_APPLICANT_APPLICATIONS, GET_SKILLS, JOBS_LOADING } from "../actions/types";

const initialState = {
  job: [],
  skills: [],
  applications: [],
  employees: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_JOBS:
      console.log("JOB PAYLOAD", action.payload)
      return {
        ...state,
        job: action.payload,
        loading: false
      };
    case GET_RECRUITER_JOBS:
      return {
        ...state,
        job: action.payload,
        loading: false
      };
    case GET_RECRUITER_EMPLOYEES:
      return {
        ...state,
        employees: action.payload,
        loading: false
      };
    case GET_SKILLS:
      return {
        ...state,
        skills: action.payload,
        loading: false
      };
    case GET_APPLICANT_APPLICATIONS:
      return {
        ...state,
        applications: action.payload,
        loading: false
      };
    case JOBS_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}