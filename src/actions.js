import fetch from 'isomorphic-fetch';


//const hostname = `https://${process.env.PROJECT_NAME}.glitch.me`;


export const actionTypes = {
  FETCH_MESSAGES: 'FETCH_MESSAGES',
  FETCH_USER: 'FETCH_USER'
};


export const actionCreators = {
  fetchMessages: function() {
    return {
      type: actionTypes.FETCH_MESSAGES,
      payload: generatePayload('GET', '/twitter/messages')
    }
  },
  fetchUser: function() {
    return {
      type: actionTypes.FETCH_USER,
      payload: generatePayload('GET', '/twitter/user')
    }
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
  }).catch(function(err) {
    console.log(err)
    return err
  });
};
