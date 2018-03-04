require('dotenv').config();

import express from 'express';
import session from 'express-session';
const RedisStore = require('connect-redis')(session);
import Grant from 'grant-express';

import redis from 'server/redis';
import router from 'server/router';
import twitterRouter from 'server/twitter/router';


var app = express();


// sessions
app.use(session({
  store: new RedisStore({
    client: redis
  }),
  secret: process.env.SECRET,
  secure: true,
  resave: false,
  saveUninitialized: true
}));


// oauth
var grant = new Grant({
  server: {
    protocol: process.env.PROTOCOL,
    host: process.env.HOSTNAME,
    callback: '/callback',
    transport: 'session'
  },
  twitter: {
    key: process.env.TWITTER_CONSUMER_KEY,
    secret: process.env.TWITTER_CONSUMER_SECRET,
    callback: '/callback'
  }
});

app.use(grant);


// handlebars
app.set('views', './views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);


// static
app.use(express.static('public'));


// server routes
app.use(function(req, res, next) {
  if (!req.session) {
    next(new Error('No session'));
  }
  next();
});

app.get('/callback', function(req, res) {
  res.redirect('/messages');
});

app.get('/disconnect', function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});

// twitter method routes
app.use('/twitter', twitterRouter);

// react router
app.use(router);


var listener = app.listen(process.env.PORT, function () {
  console.log('servinggg on port ' + listener.address().port);
});
