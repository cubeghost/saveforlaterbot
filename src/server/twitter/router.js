import express from 'express';
import bodyParser from 'body-parser';

import TwitterCache from 'server/twitter/cache';

const twitterRouter = express.Router();

twitterRouter.use(bodyParser.urlencoded({ extended: true }));
twitterRouter.use(bodyParser.json());

twitterRouter.use(function(req, res, next) {
  if (req.session.grant && req.session.grant.response) {
    next();
  } else {
    res.statusMessage = 'No Twitter session';
    res.status(401).json({
      code: 'no_twitter_session',
      message: 'No Twitter session'
    });
  }
});

twitterRouter.get('/messages', function(req, res, next) {
  const client = new TwitterCache(req);
  client.directMessages().then(directMessages => {
    const status = client.modified ? 200 : 304; // does this work???
    res.status(status).json(directMessages);
  }).catch(err => {
    console.error(err);
    res.status(500).send(err.message);
  });
});

twitterRouter.get('/user', function(req, res, next) {
  const client = new TwitterCache(req);
  client.user().then(user => {
    const status = client.modified ? 200 : 304;
    res.status(status).json(user);
  }).catch(err => {
    console.error(err);
    res.status(500).send(err.message);
  });
});

export default twitterRouter;
