import React, { Component } from 'react';

import io from 'socket.io-client';

import get from 'lodash/get';
import copy from 'copy-to-clipboard';
import { LocalForm, Control } from 'react-redux-form';

import './App.css';
import './Emoji.css';

import emojis from './emojis-util';

const socket = io(process.env.REACT_APP_SOCK_URL || `http://localhost`)

function getQueryParams(qs) {
  qs = qs.split('+').join(' ');

  let params = {},
      tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}

// with more time this component would be broken 
// into sub components FOR SURE
class App extends Component {
  constructor() {
    super();
    this.state = {
      url: null,
      askingQuestion: false,
      error: null,
    };
  }

  componentWillMount() {
    const {
      z: room
    } = getQueryParams(document.location.search);

    this.room = room;
    socket.on('connect', () => {

       // Connected, let's sign-up for to receive messages for this room
       socket.emit('room', { room, name: 'Daniel' });
    });

    socket.on('noslides', ({ error }) => {
      console.error(error);
      this.setState({ error });
    });

    socket.on('react', (data) => {
      console.log(data);
    });

    socket.on('slides', ({ url, name }) => {
      console.log(url);
      this.setState({
        error: null,
        url,
        speakerName: name
      })
    });

    // socket.in(room).emit(`in${room}`, 'HERE');
    //  socket.emit('room', room);

    // socket.on('event', (data) => {
    //   console.log(data);
    // });

    // socket.on("", (data) => {
    //   // this will be the Slides url
    //   this.setState({
    //     url: get(data, 'data.url'),
    //     speakerName: get(data, 'data.name')
    //   })
    // });
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
    const intensity = Math.random();

    // getRequest(`${process.env.REACT_APP_API_URL}react?emoji=${emoji}&intensity=${intensity}`)
      // .catch((err) => console.error(err))
    
    socket.emit('react', {
      emoji,
      intensity,
    });
  }

  handleSubmitQuestion(values) {
    const question = get(values, 'question');
    // normally we would just do a socket emit here,
    // but we want to store our data in php
    // getRequest(`${process.env.REACT_APP_API_URL}ask?question=${question}`)
    //   .catch((err) => console.error(err))
    socket.emit('question', {
      question,
      name: 'Bob Witherspoon',
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
      error,
    } = this.state;

    return (
      <div className="App">
        {error ? (
          <div className="App-alert -error">
            {error}
          </div>
        ) : null}
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
