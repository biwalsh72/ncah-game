import React from 'react';
import './style.scss';
var createReactClass = require('create-react-class');

const Form = createReactClass({
  onSubmit(evt) {
    evt.preventDefault();
    const input = this.refs.input;
    const message = input.value;
    //let tmp_user = JSON.parse(sessionStorage.getItem('user'));
    let sender = this.props.currentUserName;
    input.value = '';
    if(message !== '') {
      this.props.onSubmit(message, sender);
    }
  },

  render() {
    return (
      <form onSubmit={ this.onSubmit } className="chatbox-form">
        <input type="text" placeholder="Type here..." ref="input" />
        <button type="submit">Send</button>
      </form>
    );
  }
});

export default Form;
