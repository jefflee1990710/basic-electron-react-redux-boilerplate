const initState = {
  logined : false,
  loginLoading : false,
  loginFailMessage : null
}

export default function authReducr(state = initState, action) {
  switch(action.type){
    case 'user_login_loading':
      state.loginLoading = true;
      state.loginFailMessage = null;
      return {...state}
    case 'user_login_done':
      state.logined = true;
      state.loginLoading = false;
      state.loginFailMessage = null;
      return {...state};
    case 'user_login_fail':
      state.loginFailMessage = 'Login fail! Please try again!';
      state.loginLoading = false;
      return {...state};
    case 'user_logout':
      state.logined = false;
      return {...state};
    default:
      return state;
  }
}
