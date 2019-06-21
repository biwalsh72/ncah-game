import React from 'react';
import _ from 'lodash';
import styles from './style.scss';
import { ChatBox, Stage } from '../';
import Cookies from 'js-cookie';

const App = React.createClass({
  getInitialState() {
    return {
      name: '',
      messages: [],
      games: [],
      players: {},
      playerCount: 0,
      whiteCardsUsed: [],
      currentGame: {},
      currentRound: null,
      gameStarted: false,
      currentUser: '',
      currentUserName: '',
      chatVisible: true
    };
  },

  componentWillMount() {
    const { socket, data } = this.props;
    socket.on('connect', this.connect);
    socket.on('updateroom', this.updateRoom);

    if (sessionStorage.user) {
      setTimeout(() => {
        socket.emit('adduser', JSON.parse(sessionStorage.user));
        this.user();
      }, 300);
      
    }
    if (this.state.currentRound !== null) {
      
    }
    window.addEventListener("beforeunload", (ev) =>
    {
      ev.preventDefault();

      socket.emit('greet', sessionStorage.user);
      
      return ev.returnValue = 'Are you sure you want exit the game?';

    });
  },



  componentWillUnMount() {
    //localStorage.clear();
  },

  getCurrentRound() {
    return JSON.stringify(this.state.currentRound);
  },

  toggleChat() {
    this.setState({
      chatVisible: !this.state.chatVisible
    });
  },

  resetGame() {
    this.props.socket.emit('start-game');
    //this.props.socket.emit('sendchat', 'Game has been reset', 'Server');
  },

  getCurrentGame() {
    return JSON.stringify(this.state.currentGame);
  },

  getGames() {
    return JSON.stringify(this.state.games);
  },

  user() {
    let user = sessionStorage.user ? JSON.parse(sessionStorage.user) : { id: null };
    console.log(user.local);

    if (this.state.players[user.id]) {
      //console.log('Return from user():');
      //console.table(this.state.players[user.id]);
      //console.log('current round: ' + this.getCurrentRound());
      //console.log('current game: ' + this.getCurrentGame());
      //console.log('games: ' + this.getGames());
      return this.state.players[user.id];
    }

    this.state.currentUserName = user.username;
    this.state.currentUser = user;

    return {};
  },

  updateRoom(update) {
    this.setState(update);
  },

  connect() {
    this.props.socket.emit('join', window.location.pathname.substring(1));
  },

  renderContent() {
    const { socket, data, currentUser } = this.props;
   // this.onSubmit();
    
    if (!currentUser && !sessionStorage.user) {
      const username = Cookies.get('username');
      Cookies.remove('username');
  
      const user = {
        id: _.uniqueId(`${ username }-${ Math.floor(Date.now() / 1000) }`),
        username
      };
  
      sessionStorage.setItem('user', JSON.stringify(user));
      this.state.currentUser = user;
      this.state.currentUserName = user.username;
  
      this.props.socket.emit('adduser', user);
    }
    
    // Here goes code if game in progress..

    return (
      <main className={ styles.main }>
        <Stage { ...this.state } user={ this.user() } socket={ socket } data={ data } />
        <div className="game-actions">
          <button onClick={ this.toggleChat } title="Toggle chat">💬</button>
          {/* <button onClick={ this.resetGame } title="Reset game (use if in a broken state">🔄</button> */}
        </div>
        <ChatBox user={ this.user() } socket={ socket } { ...this.state } />
      </main>
    );
  },

  render() {
    return this.renderContent();
  }
});

export default App;
