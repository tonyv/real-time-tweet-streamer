import React from "react";
import Moment from "react-moment";
import "../stylesheets/Tweet.css";

const Tweet = ({ json }) => {
  const { created_at, id } = json.data;
  const { name = "", username = "" } = json.includes.users[0];

  const hashtags = () => {
    if (json.data.entities && json.data.entities.hashtags) {
      return json.data.entities.hashtags.map((hashtag) => (
        <span key={hashtag.tag} className="ui label">
          #{hashtag.tag}
        </span>
      ));
    }
  };

  const title = () => {
    const { entities } = json.data;

    if (
      entities &&
      entities.urls &&
      entities.urls[0] &&
      entities.urls[0].title
    ) {
      return entities.urls[0].title;
    } else {
      return json.data.text.substring(0, 32) + "...";
    }
  };

  return (
    <a
      href={`http://www.twitter.com/${username}/status/${id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="ui segment tweet">
        <h4 className="ui header">
          {title()}
          <div className="sub header">{name}</div>
          <Moment
            className="sub header"
            parse="YYYY-MM-DDTHH:mm:ss.ZZZZ"
            fromNow
          >
            {created_at}
          </Moment>
        </h4>
        <p>{json.data.text}</p>
        {hashtags()}
      </div>
    </a>
  );
};

export default Tweet;
