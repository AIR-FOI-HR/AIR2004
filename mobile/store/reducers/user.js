const initialState = {
  userId: null,
  name: null,
  surname: null,
  token: null,
  userType: null,
  themePreference: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        userId: action.user.userId,
        name: action.user.name,
        surname: action.user.surname,
        token: action.user.token,
        userType: action.user.userType,
      };
    case "SIGN_OUT":
      return initialState;

    case "SET_THEME":
      return {
        ...state,
        themePreference: action.themePref,
      };

    default:
      return state;
  }
};

export default userReducer;
