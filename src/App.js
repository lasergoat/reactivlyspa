import React, { Component } from 'react';

import io from 'socket.io-client';

import get from 'lodash/get';

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
  sendEmoji(emoji) {
    socket.emit('emoji', {
      name: 'Bob',
      text: emoji
    })
    console.log(emoji);
  }
  render() {
    const {
      url
    } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <img src="reactivly-logo.png" className="App-logo" alt="logo" />
        </div>
        <div className="App-content">
          {url ? (
            <div className="url-wrapper">
              <h3>Sides:</h3>
              <a target="_blank" href={url}>{url}</a>
            </div>
          ) : null}
          <div className="emoji-wrapper">
            {emojis.map((emoji) => (
              <div
                className="emoji"
                key={emoji}
                onClick={() => this.sendEmoji(emoji)}
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
