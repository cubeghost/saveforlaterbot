import React from 'react';
import { Col, Button } from 'reactstrap';

const Connect = () => {
  return (
    <Col>
      <Button size="lg" color="primary" tag="a" href="/connect/twitter">
        Connect to Twitter
      </Button>
    </Col>
  );
};

export default Connect;
