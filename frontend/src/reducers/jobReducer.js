import { GET_JOBS, GET_SKILLS, JOBS_LOADING } from "../actions/types";

const initialState = {
  job: [],
  skills: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_JOBS:
      return {
        ...state,
        job: action.payload,
        loading: false
      };
    case GET_SKILLS:
      return {
        ...state,
        skills: action.payload,
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