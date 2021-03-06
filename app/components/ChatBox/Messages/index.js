import React from 'react';
import classnames from 'classnames';
import './style.scss';
import jquery from 'jquery';
var createReactClass = require('create-react-class');

const Messages = createReactClass({
  renderMessage(message, i) {
    const { user, currentUserName } = this.props;
    const classNames = {
      message: true,
      'is-users': user && currentUserName === message.username
    };
    classNames[`${ message.type }-message`] = true;

    return (
      <div key={ i } className={ classnames(classNames) }>
        <span className="username">{  message.username }</span>
        <p dangerouslySetInnerHTML={{ __html: message.text }} />
      </div>
    );
  },

  renderMessages() {
    return this.props.messages.map(this.renderMessage);
  },

  render() {
    return (
      <div className="chatbox-messages">
        { this.renderMessages() }
      </div>
    );
  }
});

export default Messages;