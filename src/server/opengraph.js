import fetch from 'isomorphic-fetch';

const API_KEY = process.env.OPENGRAPH_IO_API_KEY;
const rootURL = 'https://opengraph.io/api/1.1/site/';

const extractUseful = json => {
  if (!json.hybridGraph) {
    console.log(json);
    throw new Error('OpenGraph.io response missing hybridGraph');
  }
  return {
    id: json._id,
    title: json.hybridGraph.title,
    description: json.hybridGraph.description,
    image: json.hybridGraph.image,
  };
};

export const fetchOpenGraph = (url) => {
  return fetch(`${rootURL}${encodeURIComponent(url)}?app_id=${API_KEY}`).then(response => {
    if (!response.ok) {
      return response.text().then(function(body) {
        throw new Error(body);
      });
    }
    return response.json();
  }).then(extractUseful);
};
