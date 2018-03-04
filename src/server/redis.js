require('dotenv').config();

import redis from 'redis';
import pifall from 'pifall';

pifall(redis.RedisClient.prototype);
pifall(redis.Multi.prototype);

var client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
);

export default client;
