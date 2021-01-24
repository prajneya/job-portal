import { GET_ERRORS } from "../actions/types";
import Swal from 'sweetalert2';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
  		Swal.fire({
			  icon: 'error',
			  title: 'Oops...',
			  text: 'Something went wrong!',
			  footer: JSON.stringify(action.payload)
			});
      return action.payload;
    default:
      return state;
  }
}