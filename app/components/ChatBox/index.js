import React from 'react';
import './style.scss';
import Messages from './Messages';
import Form from './Form';
var createReactClass = require('create-react-class');

const ChatBox = createReactClass({
  onSubmit(message, sender) {
    setTimeout(() => {
      this.props.socket.emit('sendchat', message, sender);
    }, 250);

    $(function () {
      $('form').on('submit', function (event) {
        event.preventDefault();
        var message = $('.message').first().clone();
        message.find('p').text($('input').val());
        message.prependTo('.chatbox');
        $('input').val('');
      });
    });
  },

  render() {
    return (
      <div className={ this.props.chatVisible ? 'chatbox' : 'hide' }>
        <Messages user={ this.props.user } currentUserName={ this.props.currentUserName } messages={ this.props.messages } />
        <Form onSubmit={ this.onSubmit } currentUserName={ this.props.currentUserName } />
      </div>
    );
  }
});

export default ChatBox;
