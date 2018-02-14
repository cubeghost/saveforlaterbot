import express from 'express';
import bodyParser from 'body-parser';

import Twitter from 'twitter';


var twitterClient = function(accessToken, accessSecret) {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: accessToken,
    access_token_secret: accessSecret
  });
};

var getUser = function(accessToken, accessSecret) {
  return new Promise(function(resolve, reject) {
    var client = twitterClient(accessToken, accessSecret);
    client.get('/account/verify_credentials', {}).then(resolve).catch(reject);
  });
};

var getDirectMessages = function(userToken, userSecret) {
  return new Promise(function(resolve, reject) {
    // client is authed with bot account
    var client = twitterClient(process.env.TWITTER_ACCESS_KEY, process.env.TWITTER_ACCESS_SECRET);
    // get oauth'd user's user id to match on
    getUser(userToken, userSecret).then(function(user) {
      var userId = user.id_str;
      // get bot's direct messages and return the ones sent by the oauth'd user
      client.get('/direct_messages', { count: 200 }).then(function(directMessages) {
        // TODO have to get all the messages not just most recent 200
        var messagesFromUser = directMessages.filter(function(message) {
          return message.sender.id_str === userId;
        });
        resolve(messagesFromUser);
      }).catch(reject);
    }).catch(reject);
  });
};

export const twitterApi = {
  getDirectMessages: getDirectMessages,
  getUser: getUser,
};



export const twitterRouter = express.Router();

// var handleError = function(res, error) {
//   console.log(error);
//   res.status(500).send(error);
// };

twitterRouter.use(bodyParser.json());

twitterRouter.use(function(req, res, next) {
  if (req.session.grant && req.session.grant.response) {
    next();
  } else {
    res.statusMessage = 'No Twitter session';
    res.status(401).send('No Twitter session');
  }
});

twitterRouter.get('/messages', function(req, res, next) {
  var { access_token, access_secret } = req.session.grant.response;
  getDirectMessages(access_token, access_secret).then(function(directMessages) {
    res.json(directMessages);
  }).catch(function(err) {
    res.status(500).send(err.message);
  });
});

twitterRouter.get('/user', function(req, res, next) {
  var { access_token, access_secret } = req.session.grant.response;
  getUser(access_token, access_secret).then(function(user) {
    res.json(user);
  }).catch(function(err) {
    res.status(500).send(err.message);
  });
});
