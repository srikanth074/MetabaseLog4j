import {
  handleActions,
  combineReducers,
  createThunkAction,
} from "metabase/lib/redux";

import { push } from "react-router-redux";

import * as MetabaseAnalytics from "metabase/lib/analytics";
import { clearGoogleAuthCredentials, deleteSession } from "metabase/lib/auth";

import { refreshSiteSettings } from "metabase/redux/settings";

import { SessionApi } from "metabase/services";

// login
export const LOGIN = "metabase/auth/LOGIN";
export const login = createThunkAction(
  LOGIN,
  (credentials, redirectUrl) => async (dispatch, getState) => {
    // NOTE: this request will return a Set-Cookie header for the session
    await SessionApi.create(credentials);

    MetabaseAnalytics.trackStructEvent("Auth", "Login");

    // unable to use a top-level `import` here because of a circular dependency
    const { refreshCurrentUser } = require("metabase/redux/user");

    await Promise.all([
      dispatch(refreshCurrentUser()),
      dispatch(refreshSiteSettings()),
    ]);
    dispatch(push(redirectUrl || "/"));
  },
);

// login Google
export const LOGIN_GOOGLE = "metabase/auth/LOGIN_GOOGLE";
export const loginGoogle = createThunkAction(LOGIN_GOOGLE, function(
  googleUser,
  redirectUrl,
) {
  return async function(dispatch, getState) {
    try {
      // NOTE: this request will return a Set-Cookie header for the session
      await SessionApi.createWithGoogleAuth({
        token: googleUser.getAuthResponse().id_token,
      });

      MetabaseAnalytics.trackStructEvent("Auth", "Google Auth Login");

      // unable to use a top-level `import` here because of a circular dependency
      const { refreshCurrentUser } = require("metabase/redux/user");

      await Promise.all([
        dispatch(refreshCurrentUser()),
        dispatch(refreshSiteSettings()),
      ]);
      dispatch(push(redirectUrl || "/"));
    } catch (error) {
      await clearGoogleAuthCredentials();
      return error;
    }
  };
});

// logout
export const LOGOUT = "metabase/auth/LOGOUT";
export const logout = createThunkAction(LOGOUT, function() {
  return async function(dispatch, getState) {
    // actively delete the session and remove the cookie
    await deleteSession();

    // clear Google auth credentials if any are present
    await clearGoogleAuthCredentials();

    MetabaseAnalytics.trackStructEvent("Auth", "Logout");

    dispatch(push("/auth/login"));

    // refresh to ensure all application state is cleared
    window.location.reload();
  };
});

// reducers

const loginError = handleActions(
  {
    [LOGIN_GOOGLE]: {
      next: (state, { payload }) => (payload ? payload : null),
    },
  },
  null,
);

export default combineReducers({
  loginError,
});
