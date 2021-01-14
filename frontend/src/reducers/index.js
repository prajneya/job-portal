import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import jobReducer from './jobReducer';

export default combineReducers({
  job: jobReducer,
  auth: authReducer,
  errors: errorReducer
});