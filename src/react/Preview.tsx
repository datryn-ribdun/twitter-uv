import React, { useMemo, useRef, useEffect, useState } from "react";
import { Tweet, Poll } from "../api/client";
import { pollOptions } from "../utils/parsing";

const placeholder = {
  author: {
    name: "",
    handle: "",
    avatar: "",
  },
  pics: [],
  time: "1d",
  video: null,
  text: "",
  quote: null,
  poll: null,
};

interface PreviewProps {
  tweet: Tweet;
}

const parseText = (text: String) => {
  const textArr = text.split(/\r?\n/);
  console.log("before parse:", textArr);
  const cleanedArr = [];
  for (let i = 0; i < textArr.length; i++) {
    if (textArr[i].length !== 0) {
      cleanedArr.push(textArr[i]);
    }
  }
  console.log("cleanedArr: ", cleanedArr);
  return cleanedArr;
};

const imageOrientation = (pics) => {
  const currentImage = new Image();
  currentImage.src = pics[0].href;

  if (currentImage.width === currentImage.height) return "";

  return currentImage.width > currentImage.height ? "landscape" : "portrait";
};

function Preview({ tweet }: PreviewProps) {
  const parsedText = parseText(tweet.text);

  return (
    <div id="tweet-preview">
      <div className="left-column">
        <div id="tweet-preview-author">
          <img id="avatar" src={tweet.author.avatar} alt="" />
          <div id="tweet-author-date-wrapper">
            <div id="tweet-author-name-wrapper">
              <span id="tweet-author-name">{tweet.author.name}</span>
              <span id="tweet-author-handle">@{tweet.author.handle}</span>
            </div>
            <p id="tweet-date">posted: {tweet.time}</p>
          </div>
        </div>
        <div id="tweet-body">
          <div id="tweet-text">
            {parsedText.map((sentence) => (
              <p key={parsedText.indexOf(sentence)}>{sentence}</p>
            ))}
          </div>
          {/* {tweet.pics.length > 0 && <Pics pics={tweet.pics} />} */}
          {tweet.poll && <Poll poll={tweet.poll} />}
          {tweet.quote && <Quote quote={tweet.quote} />}
        </div>
      </div>
      <div className="right-column">
        <div className="cropped">
          {tweet.pics.length > 0 && <Pics pics={tweet.pics} />}
        </div>
      </div>
    </div>
  );
}

function Quote({ quote }) {
  return (
    <div id="tweet-quote">
      <div id="tweet-quote-author">
        <p id="tweet-quote-author-name">{quote.author.name}</p>
        <p id="tweet-quote-author-handle">@{quote.author.handle}</p>
        <p id="tweet-quote-time">{quote.time}</p>
      </div>
      <div id="tweet-quote-body">
        {quote.text}
        {/* {!quote.video && quote.pics.length > 0 && <Pics pics={quote.pics} />} */}
        {quote.video && <Video video={quote.video} />}
        {quote.poll && <Poll poll={quote.poll} />}
      </div>
    </div>
  );
}

function Pics({ pics }) {
  const [loaded, setLoaded] = useState(false);

  const imageClass = useMemo(() => {
    return loaded ? `img-${pics.length} ${imageOrientation(pics)}` : "";
  }, [loaded]);

  return (
    <div id="tweet-pictures" className={pics.length > 1 ? "multi-pics" : ""}>
      {pics && (
        <>
          <img
            className={imageClass}
            src={pics[0]}
            alt=""
            onLoad={() => setLoaded(true)}
          />
          <div className="plus-sign">+</div>
          <div className="pics-count">{pics.length - 1}</div>
        </>
      )}
    </div>
  );
}

function Video({ video }) {
  return (
    <div id="tweet-video">
      <video preload="none" playsInline controls src={video}></video>
    </div>
  );
}

function Poll({ poll }) {
  const options = pollOptions(poll);

  return (
    <div id="twitter-poll">
      {options.map((opt, i) => {
        return (
          <div key={i} className="twitter-poll-option">
            <p>{opt.label}</p>
            <p>{opt.count}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Preview;
