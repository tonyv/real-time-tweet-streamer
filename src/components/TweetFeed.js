import React, { useEffect, useReducer } from "react";
import Tweet from "./Tweet";
import socketIOClient from "socket.io-client";
import ErrorMessage from "./ErrorMessage";
import Spinner from "./Spinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "add_tweet":
      return {
        ...state,
        tweets: [action.payload, ...state.tweets],
        error: null,
        isWaiting: false,
      };
    case "show_error":
      return { ...state, error: action.payload, isWaiting: false };
    case "update_waiting":
      return { ...state, error: null, isWaiting: true };
    default:
      return state;
  }
};

const TweetFeed = () => {
  const initialState = {
    tweets: [],
    error: {},
    isWaiting: true,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { tweets, error, isWaiting } = state;

  const streamTweets = () => {
    const socket = socketIOClient("/");
    socket.on("connect", () => {});
    socket.on("tweet", (json) => {
      if (json.data) {
        dispatch({ type: "add_tweet", payload: json });
      }
    });
    socket.on("heartbeat", (data) => {
      dispatch({ type: "update_waiting" });
    });
    socket.on("error", (data) => {
      dispatch({ type: "show_error", payload: data });
    });
  };

  const errorMessage = () => {
    const message = {
      title: "Reconnecting",
      detail: "Please wait while we reconnect to the stream.",
    };

    if (error && error.detail) {
      return (
        <div className="twelve wide column">
          <ErrorMessage key={error.title} error={error} styleType="warning" />
          <ErrorMessage
            key={message.title}
            error={message}
            styleType="success"
          />
          <Spinner />
        </div>
      );
    }
  };

  const waitingMessage = () => {
    const message = {
      title: "Still working",
      detail: "Waiting for new Tweets to be posted",
    };

    if (isWaiting) {
      return (
        <React.Fragment>
          <div className="twelve wide column">
            <ErrorMessage
              key={message.title}
              error={message}
              styleType="success"
            />
          </div>
          <Spinner />
        </React.Fragment>
      );
    }
  };

  useEffect(() => {
    streamTweets();
  }, []);

  const showTweets = () => {
    if (tweets.length > 0) {
      return (
        <div className="ui segments">
          {tweets.map((tweet) => (
            <Tweet key={tweet.data.id} json={tweet} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="twelve wide stretched column">
      {errorMessage()}
      {waitingMessage()}
      {showTweets()}
    </div>
  );
};

export default TweetFeed;
