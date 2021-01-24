import { SET_CURRENT_USER, USER_LOADING, GET_PROFILE, GET_APPLICANT_PROFILE, GET_RECRUITER_PROFILE, UPDATE_PERSONAL_SETTINGS } from "../actions/types";
import Swal from 'sweetalert2';

const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
  personal: {},
  educational: {},
  recruiter: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROFILE:
      return {
        ...state,
        personal: action.payload
      };
    case GET_APPLICANT_PROFILE:
      return {
        ...state,
        educational: action.payload
      };
    case GET_RECRUITER_PROFILE:
      return {
        ...state,
        recruiter: action.payload
      };
    case UPDATE_PERSONAL_SETTINGS:
      Swal.fire({
        icon: 'success',
        title: 'Profile Settings updated',
        text: 'Some changes might reflect after logging in again.',
        footer: 'If you logged in with Google, you cannot change your email.'
      });
      return {
        ...state
        
      }
    default:
      return state;
  }
}