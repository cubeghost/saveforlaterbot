import React from 'react';
import { Route } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Header from 'components/header';

import routes from 'src/routes';

const App = (props) => {
  return (
    <Container className="my-3">
      <Row>
        <Col>
          <Header />
        </Col>
      </Row>
      <Row>
      {/* <Row className="content"> */}
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
      </Row>
    </Container>
  );
};

export default App;
