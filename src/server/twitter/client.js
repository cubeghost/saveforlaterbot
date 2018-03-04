import autobind from 'class-autobind';
import Twitter from 'twitter';

import { fetchOpenGraph } from 'server/opengraph';

const createClient = function(accessToken, accessSecret) {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: accessToken,
    access_token_secret: accessSecret
  });
};

const tweetUrlRegex = new RegExp('^https:\/\/twitter\.com\/[^\/]+\/status\/([0-9]+)', 'i');

const cleanMessages = (directMessages) => {
  return directMessages.map(dm => {
    const message = {
      id: dm.id,
      text: dm.text,
      tweets: [],
      links: [],
      _entities: dm.entities,
    };

    dm.entities.urls.forEach(url => {
      if (!url) return;
      if (tweetUrlRegex.test(url.expanded_url)) {
        message.tweets.push({
          id: tweetUrlRegex.exec(url.expanded_url)[1]
        });
        message.text = message.text.replace(url.url, '');
      } else {
        message.links.push({
          url: url.expanded_url,
          display_url: url.display_url,
        });
        message.text = message.text.replace(url.url, '');
      }
    });

    return message;
  });
};

const getOpenGraphAttachments = async (directMessages) => {
  await Promise.all(directMessages.map(async message => {
    if (message.links.length) {
      const links = await Promise.all(message.links.map(async link => {
        try {
          const og = await fetchOpenGraph(link.url);
          return Object.assign(link, { opengraph: og });
        } catch (error) {
          return Object.assign(link, { opengraph: { error: error } });
        }
      }));
      return Object.assign(message, { links });
    } else {
      return message;
    }
  }));
  return directMessages;
};

export default class TwitterClient {
  constructor(accessToken, accessSecret) {
    this.accessToken = accessToken;
    this.accessSecret = accessSecret;
    this.client = createClient(accessToken, accessSecret);
    autobind(this);
  }

  async getUser() {
    const user = await this.client.get('/account/verify_credentials', {});
    user._accessToken = this.accessToken;
    return user;
  }

  async getDirectMessages() {
    // client is authed with bot account
    var client = createClient(process.env.TWITTER_ACCESS_KEY, process.env.TWITTER_ACCESS_SECRET);
    // get oauth'd user's user id to match on
    const user = await this.getUser();
    const userId = user.id_str;
    // get bot's direct messages and return the ones sent by the oauth'd user
    const response = await client.get('/direct_messages/events/list', { count: 20 });

    if (Array.isArray(response) && response[0].code) {
      console.log(response[0].code)
      throw new Error(response[0]);
    }
    // TODO paginate
    var messagesFromUser = response.events.filter(ev => {
      return ev.type === 'message_create' && ev.message_create.sender_id === userId;
    }).map(ev => {
      return {
        id: ev.id,
        ...ev.message_create.message_data
      };
    });

    const cleanedMessages = cleanMessages(messagesFromUser);
    // TODO if (openGraphEnabled)
    const messagesWithOpenGraph = await getOpenGraphAttachments(cleanedMessages);
    return messagesWithOpenGraph;
  }
}

// export const twitterClient = {
//   getDirectMessages: getDirectMessages,
//   getUser: getUser,
// };
