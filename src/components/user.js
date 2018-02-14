import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class User extends Component {
  componentWillMount() {
    if (typeof window !== 'undefined' && !this.props.user) {
      this.props.dispatch(this.props.route.preload.actionCreator());
    }
  }

  render() {
    const { user } = this.props;

    return (
      <aside>
        <p>
          connected as {user && user.screen_name}
        </p>
        <a href="/disconnect">disconnect</a>
      </aside>
    );
  }
};

const mapStateToProps = store => ({
  user: store.user
});

export default withRouter(connect(mapStateToProps)(User));
