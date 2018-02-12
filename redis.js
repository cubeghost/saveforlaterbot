require('dotenv').config();

import redis from 'redis';

var client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
);

export default client;
