import { combineReducers } from 'redux';
import unionBy from 'lodash.unionby';

import { actionTypes } from './actions';

const initialState = {
  user: {},
  directMessages: [],
  errors: []
};

const user = (state, action) => {
  if (typeof state === 'undefined') {
    return initialState.user;
  }

  switch (action.type) {
    case actionTypes.FETCH_USER:
      return action.payload;
    default:
      return state;
  }
};

var directMessages = function(state, action) {
  if (typeof state === 'undefined') {
    return initialState.directMessages;
  }

  switch (action.type) {
    case actionTypes.FETCH_MESSAGES:
      return unionBy(action.payload, state, 'id');
    default:
      return state;
  }
};

var errors = function(state, action) {
  if (typeof state === 'undefined') {
    return initialState.errors;
  }

  if (action.error) {
    const error = action.payload;
    try {
      const json = JSON.parse(error.message);

      if (json.code === 'no_twitter_session') {
        return [...state, json];
      }
    } catch (e) {
      console.error(error);
    }
  }

  return state;
};

export default combineReducers({
  user,
  directMessages,
  errors
});
