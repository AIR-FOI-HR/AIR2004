import { createStore, applyMiddleware } from "redux";
import combinedReducer from "./reducers/index";
import signInOutMiddleware from "../middleware/signInOut";

const store = createStore(combinedReducer, applyMiddleware(signInOutMiddleware));

export default store;
