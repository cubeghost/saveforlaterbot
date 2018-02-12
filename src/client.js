import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';

import { Provider } from 'react-redux';
import configureStore from './store';

import routes from './routes';

import './styles/style.scss';

var initialState = window.__REDUX_STATE__ || {};
if (window.__REDUX_STATE__) {
  document.getElementById('redux-state').outerHTML = '';
}

var store = configureStore(initialState);


var router = (
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>
);

ReactDOM.render(router, document.getElementById('react-root'));
