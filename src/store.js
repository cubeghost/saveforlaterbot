import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import reducers from './reducers';

let composeEnhancers = compose;
if (
  typeof window !== 'undefined' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  process.env.NODE_ENV !== 'production'
) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

function configureStore(initialState) {
  return createStore(reducers, initialState, composeEnhancers(
    applyMiddleware(promiseMiddleware)
  ));
}

export default configureStore;
