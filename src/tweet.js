import React, { Component } from 'react';
import PropTypes from 'prop-types';
import scriptLoader from 'react-async-script-loader';

class Tweet extends Component {

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      if (isScriptLoadSucceed) {
        this.embed();
      }
    }
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.embed();
    }
  }

  embed() {
    if (!window.twttr) {
      console.error('Failed to load window.twttr');
      return;
    }

    window.twttr.widgets.createTweet(
      this.props.id,
      this.refs.embedContainer
    );
  }

  render() {
    return (
      <div ref="embedContainer" />
    );
  }
};

Tweet.propTypes = {
  id: PropTypes.string.isRequired
};

export default scriptLoader('https://platform.twitter.com/widgets.js')(Tweet);
