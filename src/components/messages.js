import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Tweet from 'components/tweet';

import { actionTypes } from 'src/actions';

// import escapeStringRegexp from 'escape-string-regexp';


const tweetUrlRegex = new RegExp('^https:\/\/twitter\.com\/[^\/]+\/status\/([0-9]+)', 'i');
const prettifyUrl = new RegExp('(^https?:\/\/)', 'i');

class Messages extends Component {

  componentWillMount() {
    if (typeof window !== 'undefined' && this.props.messages.length === 0) {
      this.props.dispatch(this.props.route.preload.actionCreator());
    }
  }

  renderMessage(message) {
    var tweets = [];
    var urls = [];
    var text = message.text;
    if (message.entities && message.entities.urls.length > 0) {
      message.entities.urls.forEach(function(url) {
        var expanded = url.expanded_url;
        if (!!expanded && tweetUrlRegex.test(expanded)) {
          const tweetId = tweetUrlRegex.exec(expanded)[1];
          tweets.push({
            id: tweetId,
          });
          text = text.replace(url.url, '');
        } else if (!!expanded) {
          // TODO eventually scrape og:meta tags for this stuff and cache on server
          urls.push({
            expanded: expanded,
            display: expanded.replace(prettifyUrl, '')
          });
          text = text.replace(url.url, '');
        }
      });
    }

    return (
      <div
        key={`directMessage-${message.id}`}
        className={classNames('directMessage', { 'directMessage--tweet': tweets && tweets.length > 0 })}
      >
        {tweets.map(function(tweet) {
          return (<Tweet key={`tweet-${tweet.id}-${message.id}`} id={tweet.id} />);
        })}
        {urls.map(function(url) {
          return (<a href={url.expanded} key={`url-${message.id}-${url.display}`} target="_blank">{url.display}</a>);
        })}
        {text}
      </div>
    );
  }

  render() {
    return (<div className="directMessages">
      {this.props.messages.map(this.renderMessage)}
    </div>);
  }

};

var mapStateToProps = function(store) {
  return {
    messages: store.directMessages
  };
};

Messages.preload = {
  type: actionTypes.FETCH_MESSAGES,
  functionName: 'getDirectMessages'
};

export default connect(mapStateToProps)(Messages);
