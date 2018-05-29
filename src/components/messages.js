import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Col } from 'reactstrap';

import Tweet from 'components/tweet';
import Link from 'components/link';

import { actionTypes } from 'src/actions';

class Messages extends Component {

  componentWillMount() {
    if (typeof window !== 'undefined' && this.props.messages.length === 0) {
      this.props.dispatch(this.props.route.preload.actionCreator());
    }
  }

  renderMessage(message) {
    const { text, tweets, links } = message;
    const messageClassNames = classNames(
      'directMessage',
      { 'directMessage--tweet': tweets && tweets.length > 0 },
      { 'directMessage--link': links && links.length > 0 }
    );

    return (
      <div
        key={`directMessage-${message.id}`}
        className={messageClassNames}
      >
        {tweets && tweets.map(function(tweet) {
          return (
            <Tweet key={`tweet-${tweet.id}-${message.id}`} id={tweet.id} />
          );
        })}
        {links && links.map(function(link) {
          return (
            <Link key={`link-${message.id}-${link.display_url}`} {...link} />
          );
        })}
        {text}
      </div>
    );
  }

  render() {
    return (
      <Col className="directMessages">
        {this.props.messages.map(this.renderMessage)}
      </Col>
    );
  }

};

var mapStateToProps = function(store) {
  return {
    messages: store.directMessages
  };
};

Messages.preload = {
  type: actionTypes.FETCH_MESSAGES,
  functionName: 'directMessages'
};

export default connect(mapStateToProps)(Messages);
