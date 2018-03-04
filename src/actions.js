import fetch from 'isomorphic-fetch';

export const actionTypes = {
  FETCH_MESSAGES: 'FETCH_MESSAGES',
  FETCH_USER: 'FETCH_USER'
};


export const actionCreators = {
  fetchMessages: function(options = { invalidate: false }) {
    return {
      type: actionTypes.FETCH_MESSAGES,
      payload: generatePayload('GET', `/twitter/messages?invalidate=${options.invalidate}`)
    };
  },
  fetchUser: function() {
    return {
      type: actionTypes.FETCH_USER,
      payload: generatePayload('GET', '/twitter/user')
    };
  },
};


function generatePayload(method, url) {
  return fetch(url, {
    method: method || 'GET',
    credentials: 'include'
  }).then(function(response) {
    if (!response.ok) {
      return response.text().then(function(body) {
        throw new Error(body);
      });
    }
    return response.json();
  });
};
