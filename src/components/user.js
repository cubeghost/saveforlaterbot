import autobind from 'class-autobind';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Col, Button } from 'reactstrap';

import { actionCreators } from 'src/actions';

class User extends Component {
  constructor() {
    super();
    autobind(this);
  }

  componentWillMount() {
    if (typeof window !== 'undefined' && !this.props.user) {
      this.props.dispatch(this.props.route.preload.actionCreator());
    }
  }

  componentWillReceiveProps(newProps) {
    if (typeof window !== 'undefined') {
      const noTwitterSession = newProps.errors.find(error => error.code === 'no_twitter_session');
      if (noTwitterSession) {
        window.location = '/disconnect';
      }
    }
  }

  render() {
    const { user } = this.props;

    return (
      <Col xs="4">
        <h4>
          connected as {user && user.screen_name}
        </h4>
        <p>
          <Button onClick={this.props.dispatchClearCache}>clear cache</Button>&nbsp;
          <Button color="secondary" outline tag="a" href="/disconnect">disconnect</Button>
        </p>
        <h6 className="mt-4">debug:</h6>
        <p>
          accessToken:&nbsp;
          <span className="bg-secondary text-secondary" style={{ wordBreak: 'break-word' }}>
            {user._accessToken}
          </span>
        </p>
      </Col>
    );
  }
};

const mapStateToProps = store => ({
  user: store.user,
  errors: store.errors,
});

const mapDispatchToProps = dispatch => ({
  dispatchClearCache: () => dispatch(actionCreators.fetchMessages({ invalidate: true }))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(User));
