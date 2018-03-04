import autobind from 'class-autobind';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

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
      <aside>
        <p>
          connected as {user && user.screen_name}
        </p>
        <button onClick={this.props.dispatchClearCache}>clear cache</button>
        <a href="/disconnect">disconnect</a>
        <p>debug:</p>
        <p>accessToken: <span style={{ backgroundColor: 'black' }}>{user._accessToken}</span></p>
      </aside>
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
