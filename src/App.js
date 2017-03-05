import React, { Component } from 'react';

import io from 'socket.io-client';

import get from 'lodash/get';
import copy from 'copy-to-clipboard';
import { LocalForm, Control } from 'react-redux-form';

import './App.css';
import './Emoji.css';

import emojis from './emojis-util';

const socket = io(`http://localhost:3001`)

// with more time this component would be broken 
// into sub components FOR SURE
class App extends Component {
  constructor() {
    super();
    this.state = {
      url: null,
      askingQuestion: false,
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
        url: get(data, 'data.url'),
        speakerName: get(data, 'data.name')
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
  }

  handleSubmitQuestion(values) {
    const question = get(values, 'question');
    socket.emit('question', {
      name: 'Bob',
      question
    });
    this.setState({ askingQuestion: false });
    this.alert(
      <span>
        Your question has been sent!!!
        <br />
        <small>"{question}"</small>
      </span>
    );
  }

  renderQuestionSection() {
    const {
      askingQuestion
    } = this.state;

    return (
      <div className="section-wrapper">
        {askingQuestion ? (
          <LocalForm
            onSubmit={(values) => this.handleSubmitQuestion(values)}
          >
            <Control.text model=".question" />
            <button>
              Send
            </button>
          </LocalForm>
        ) : (
          <a
            onClick={() => this.setState({askingQuestion: true})}
            target="_blank"
          >
            Ask A Question
          </a>
        )}
      </div>
    );
  }
  render() {
    const {
      url,
      speakerName,
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
            <div className="section-wrapper">
              {speakerName ? (
                <h3>{speakerName} is presenting...</h3>
              ) : null}
              <a
                href={url}
                target="_blank"
              >
                Open Sides
              </a>
              <a
                onClick={() => this.handleCopySlides()}
              >
                Copy Sides Url
              </a>
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
          {this.renderQuestionSection()}
        </div>
      </div>
    );
  }
}

export default App;
