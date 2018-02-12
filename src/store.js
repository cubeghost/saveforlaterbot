import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import reducers from './reducers';

var createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore);

function configureStore(initialState) {
  return createStoreWithMiddleware(reducers, initialState);
}

export default configureStore;
