import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from 'components/header';

import routes from 'src/routes';

const App = (props) => {
  return (
    <div className="appRoot">
      <Header />

      <div className="content">
        {routes.map((route, index) => (
          <Route
            path={route.path}
            exact={route.exact}
            key={`route-${index}`}
            render={renderProps => {
              const Component = route.component;
              return (
                <Component {...renderProps} route={route} />
              );
            }}
          />
        ))}
      </div>


    </div>
  );
};

export default App;
