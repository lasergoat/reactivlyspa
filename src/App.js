import React, { Component } from 'react';

import 'socket.io';

import './App.css';
import './Emoji.css';

import emojis from './emojis-util';

class App extends Component {
  sendEmoji(emoji) {
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
