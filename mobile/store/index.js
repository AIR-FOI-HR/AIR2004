import { createStore, applyMiddleware } from "redux";

import combinedReducer from "./reducers/index";
import signInOutMiddleware from "../middleware/signInOut";
import teacherAttendanceMiddleware from "../middleware/teacherAttendance";

const store = createStore(combinedReducer, applyMiddleware(signInOutMiddleware, teacherAttendanceMiddleware));

export default store;
