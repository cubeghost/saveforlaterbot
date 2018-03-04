import autobind from 'class-autobind';

import redis from 'server/redis';
import TwitterClient from 'server/twitter/client';

const DEFAULT_EXPIRY = 15 * 60;

export default class TwitterCache {

  constructor(req) {
    const { access_token, access_secret } = req.session.grant.response;
    this.invalidate = req.query.invalidate === 'true';
    this.accessToken = access_token;
    this.accessSecret = access_secret;
    this.client = new TwitterClient(access_token, access_secret);
    this.modified = false;
    autobind(this);
  }

  async get(key, method) {
    const reply = !this.invalidate ? await redis.getAsync(key) : null;

    if (reply === null) {
      try {
        const value = await method();
        await redis.setAsync(key, JSON.stringify(value, { JSON: true }), 'EX', DEFAULT_EXPIRY);
        this.modified = true;
        return value;
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    } else {
      return JSON.parse(reply);
    }
  }

  async clear(key) {
    // TODO
  }

  async user() {
    const key = `saveforlaterbot:${this.accessToken}:user`;
    return await this.get(key, this.client.getUser);
  }

  async directMessages() {
    const key = `saveforlaterbot:${this.accessToken}:messages`;
    return await this.get(key, this.client.getDirectMessages);
  }

};
