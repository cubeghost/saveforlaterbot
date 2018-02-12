import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './app';
import Connect from './connect';
import Messages from './messages';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Connect} />
    <Route path="/messages" component={Messages} />
  </Route>
);

export default routes;