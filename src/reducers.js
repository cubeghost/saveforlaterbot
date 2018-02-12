import { combineReducers } from 'redux';

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
  }

  return state;
};

var directMessages = function(state, action) {
  if (typeof state === 'undefined') {
    return initialState.directMessages;
  }

  switch (action.type) {
    case actionTypes.FETCH_MESSAGES:
      return [...state, ...action.payload];
  }

  return state;
};

var errors = function(state, action) {
  if (typeof state === 'undefined') {
    return initialState.errors;
  }

  return state;
};

export default combineReducers({
  directMessages,
  errors
});
