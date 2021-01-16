const initialState = {
  loggedUser: null,
  courseEdit: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN":
      return { ...state, loggedUser: action.user };
    case "LOG_OUT":
      return initialState;
    case "EDIT_COURSE":
      return { ...state, courseEdit: action.selectedRow };
    default:
      return state;
  }
};

export default userReducer;
