import React from 'react';

const Link = ({
  url,
  display_url,
  opengraph,
}) => {
  if (opengraph) {
    const { title, description, image } = opengraph;
    return (
      <a href={url} target="_blank">
        <div className="opengraphPreview">
          <img src={image} />
          <h4>{title}</h4>
          <p className="opengraphPreview-description">{description}</p>
        </div>
      </a>
    );
  } else {
    return (<a href={url} target="_blank">{display_url}</a>);
  }
};

export default Link;
