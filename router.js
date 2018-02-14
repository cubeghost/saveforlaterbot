import React from 'react';
import { renderToString } from 'react-dom/server';
import { matchPath } from 'react-router-dom';
import { StaticRouter } from 'react-router';
import serialize from 'serialize-javascript';

import { Provider } from 'react-redux';
import configureStore from 'src/store';

import { twitterApi } from './twitter';

import App from 'components/app';

import routes from 'src/routes';

var router = (req, res, next) => {

  var store = configureStore();

  const preloadRequests = [];
  const matches = [];
  routes.forEach(route => {
    const match = matchPath(req.path, route);

    if (match && route.preload) {
      preloadRequests.push(route.preload);
    }
    if (match) {
      matches.push(match);
    }
  });

  new Promise((resolve, reject) => {

    if (preloadRequests.length > 0) {
      if (!req.session || !req.session.grant) {
        resolve();
      }
      var { access_token, access_secret } = req.session.grant.response;
      Promise.all(preloadRequests.map(preload => {
        return store.dispatch({
          type: preload.actionType,
          payload: twitterApi[preload.functionName].bind(null, access_token, access_secret)(preload.args)
        });
      })).then(resolve).catch(reject);
    } else {
      resolve();
    }

  }).then(result => {

    const context = {};
    const state = store.getState();
    const html = renderToString(
      <Provider store={store}>
        <StaticRouter
          location={req.url}
          context={context}
        >
          <App />
        </StaticRouter>
      </Provider>
    );

    res.render('index', {
      body: html,
      state: serialize(state, { JSON: true })
    });

  }).catch(error => {
    console.error(error);
    res.status(500).send(error);
  });

};

export default router;
