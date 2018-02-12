import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import serialize from 'serialize-javascript';

import { Provider } from 'react-redux';
import configureStore from './src/store';

import { twitterApi } from './twitter';

import routes from './src/routes';


var router = function(req, res, next) {

  var store = configureStore();

  match({
    routes: routes,
    location: req.originalUrl,
  }, function(err, redirectLocation, renderProps) {

    if (redirectLocation) {
      // redirect
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
    } else if (err) {
      // error
      console.log(err);
      res.send(500, err.message);
    } else if (renderProps === null || renderProps === undefined) {
      // no route
      res.status(404).send('Not found');
    } else {
      // render

      new Promise(function(resolve, reject) {

        var component = renderProps.components[renderProps.components.length - 1];  // 😬
        if (!!component && !!component.preload) {
          if (typeof component.preload == 'function') {
            component.preload(renderProps.params, store.dispatch).then(resolve).catch(resolve);
          } else {
            if (!req.session || !req.session.grant) {
              resolve();
            }
            var { access_token, access_secret } = req.session.grant.response;
            store.dispatch({
              type: component.preload.type,
              payload: twitterApi[component.preload.functionName].bind(null, access_token, access_secret)(component.preload.args)
            }).then(resolve).catch(reject);
          }
        } else {
          resolve();
        }

      }).then(function(result) {

        var rootComponent = (React.createElement(
          Provider,
          { store: store },
          React.createElement(RouterContext, renderProps)
        ));
        var html = renderToString(rootComponent);
        var state = store.getState();

        res.render('index', {
          body: html,
          state: serialize(state, { JSON: true })
        });

      });

    }
  });

}

export default router;
