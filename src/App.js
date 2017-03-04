import React, { Component } from 'react';

import io from 'socket.io-client';

import './App.css';
import './Emoji.css';

import emojis from './emojis-util';

const socket = io(`http://localhost:3001`)

class App extends Component {
  componentWillMount() {
    socket.on('event', (data) => {
      console.log(data);
    });

    socket.on("R:App\\Events\\BeginSlides", (message) => {
        // increase the power everytime we load test route
        console.log(message)
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
    return (
      <div className="App">
        <div className="App-header">
          <img src="reactivly-logo.png" className="App-logo" alt="logo" />
        </div>
        <div className="App-content">
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
