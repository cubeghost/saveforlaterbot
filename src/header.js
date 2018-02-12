import React from 'react';
import { connect } from 'react-redux';

const Header = (props) => (
  <header>
    <h1>saveforlaterbot</h1>
    {console.log(props)}
  </header>
);

const mapStateToProps = store => ({
  user: store.user
});

export default connect(mapStateToProps)(Header);
