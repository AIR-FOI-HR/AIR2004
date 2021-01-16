import userReducer from "./user";
import teacherReducer from "./teacher";
import { combineReducers } from "redux";

const combinedReducer = combineReducers({
  userState: userReducer,
  teacherState: teacherReducer,
});

export default combinedReducer;
