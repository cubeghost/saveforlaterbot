import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from 'src/store';

import App from 'components/app';

import './styles/style.scss';

var initialState = window.__REDUX_STATE__ || {};
if (window.__REDUX_STATE__) {
  document.getElementById('redux-state').outerHTML = '';
}

var store = configureStore(initialState);

var router = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.hydrate(router, document.getElementById('react-root'));
