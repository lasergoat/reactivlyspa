import React, { Component } from 'react';

import io from 'socket.io-client';

import get from 'lodash/get';
import copy from 'copy-to-clipboard';

import './App.css';
import './Emoji.css';

import emojis from './emojis-util';

const socket = io(`http://localhost:3001`)

class App extends Component {
  constructor() {
    super();
    this.state = {
      url: null,
    };
  }
  componentWillMount() {
    socket.on('event', (data) => {
      console.log(data);
    });

    socket.on("R:App\\Events\\BeginSlides", (data) => {
      // this will be the Slides url
      console.log(data);
      this.setState({
        url: get(data, 'data.url')
      })
    });
  }

  alert(message) {
    this.setState({
      alert: message
    });

    // in 5 seconds remove the alert
    setTimeout(() => {
      this.setState({ alert: null })
    }, 5000)
  }

  handleCopySlides() {
    const {
      url
    } = this.state;

    copy(url);

    this.alert('The Slides URL Has been copied to your clipboard!');

  }

  handleSendEmoji(emoji) {
    socket.emit('emoji', {
      name: 'Bob',
      text: emoji
    })
    console.log(emoji);
  }
  render() {
    const {
      url,
      alert,
    } = this.state;

    return (
      <div className="App">
        {alert ? (
          <div className="App-alert">
            {alert}
          </div>
        ) : null}
        <div className="App-header">
          <img src="reactivly-logo.png" className="App-logo" alt="logo" />
        </div>
        <div className="App-content">
          {url ? (
            <div className="url-wrapper">
              <a
                href={url}
                target="_blank"
              >
                Open Sides
              </a>
              <button
                type="button"
                onClick={() => this.handleCopySlides()}
              >
                Copy Sides Url
              </button>
            </div>
          ) : null}
          <div className="emoji-wrapper">
            {emojis.map((emoji) => (
              <div
                className="emoji"
                key={emoji}
                onClick={() => this.handleSendEmoji(emoji)}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
