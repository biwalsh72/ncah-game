const _ = require('lodash');
const Room = require('./room.js');
const Player = require('./player.js');
const User = require('../server.js');
//bug fixes
const {
  cleanString,
  urlifyText
} = require('../utils');

//Defining serverside rules for gameplay on a CahServer (called in server.js)
class CahServer {
  constructor(io) {
    this.io = io; 
    this.rooms = {};
  }

  init(socket) {
    this.socket = socket;
    socket.on('reconnect', () => {
      socket.emit('subscribe', window.location.pathname.substring(1))
    });
    socket.on('join', this.userJoined.bind(this));
    socket.on('disconnect', this.userLeft.bind(this));
    socket.on('respond', this.userClosed.bind(this));
    socket.on('adduser', this.addPlayer.bind(this));
    socket.on('sendchat', this.sendChat.bind(this));
    socket.on('start-game', this.startGame.bind(this));
    socket.on('player-submission', this.playerSubmitted.bind(this));
    socket.on('winner-chosen', this.winnerChosen.bind(this));
    socket.on('next-round', this.nextRound.bind(this));
  }

  //add user to socket room when they join a game
  userJoined(roomName) {
    this.rooms[roomName] = this.rooms[roomName] || new Room(roomName);
    this.socket.room = this.rooms[roomName];
    this.socket.join(roomName);
    this.updateRoom();
  }

  //display message when a user closes out of the game
  userClosed(data) {
    console.log('user Closed');
    this.socket.room.newMessage({
      username: 'Server',
      text: `
        ${ data.username } has left\n
        (player count: ${ this.socket.room._playerCount })`,
      type: 'server'
    });
    this.updateRoom();
  }

  //disconnect player from socket room
  userLeft(reason) {

    console.log('reason: ' + reason);

    this.socket.player = User.data;

    if (this.socket.room && this.socket.player && this.socket.player.username !== undefined) {

      this.socket.room.playerLeft(this.socket.player.id);
      console.log('user ' + this.socket.player.username + ' left ' + this.socket.room.name);

      this.updateRoom();

      if (this.socket.room._playerCount < 3) {
        console.log('Less than 3 players in the game. Restarting.');

        this.updateRoom();

        this.socket.room.newMessage({
          username: 'Server',
          text: `<strong>A player left, starting a new game.</strong>`,
          type: 'server'
        });

        this.startGame();
      }
    }
  }

  //after user is added to the room, add them as a player to the game
  addPlayer(player) {
    let {
      id,
      username
    } = player;

    if (username === null || username === "") {
      username = `Guest${ id }`;
    } else {
      username = cleanString(username);
    }


    if (this.socket.room) {
      const newPlayer = new Player(id, username);

      this.socket.player = newPlayer;  ///this the problem (always equal the last player that joined)
      try {
        this.socket.room.addPlayer(newPlayer);
        console.log(username + ' joined ' + this.socket.room.name)
      } catch (err) {
        console.log(err);
      }

      this.socket.room.newMessage({
        username: 'Server',
        text: `${ username } has joined (player count: ${ this.socket.room._playerCount })`,
        type: 'server'
      });

      this.updateRoom();
    }

    this.updateRoom();
  }

  //self-explanatory
  sendChat(data, username) {

    if (this.socket.room) {
      this.socket.room.newMessage({
        username: username,
        text: urlifyText(cleanString(data)),
        type: 'chat'
      });
      console.log('chat message to ' + this.socket.room.name + ' ' + username + ': ' + data);
    }
    this.updateRoom();
  }

  //start game and choose new card czar
  startGame() {
    this.socket.room.newGame();
    this.displayNextCzar();
    this.updateRoom();
  }

  //send message to the server about who the next card czar is
  displayNextCzar() {
    const {
      room
    } = this.socket;
    if (room._currentGame.rounds.length && room._currentCzar.username && room._currentCzar !== undefined) {
      room.newMessage({
        username: 'Server',
        text: `Round ${ room._currentGame.rounds.length } - ${ room._currentCzar.username } is the Czar`,
        type: 'server'
      });
    }

  }

  //move to next round when game is in progress
  nextRound(gameId) {
    const {
      room
    } = this.socket;

    const game = room.getGameById(gameId);
    game.newRound(room.players);
    this.displayNextCzar();

    this.updateRoom();
  }

  //when a player submits a card during a round
  playerSubmitted(gameId, roundId, playerId, choices) {
    const game = this.socket.room.getGameById(gameId);

    if (game.getRoundById(roundId)) {
      const round = game.getRoundById(roundId);
      round.playerSubmitted(playerId, choices);

      this.updateRoom();
    }
  }

  //choose and display who won the last round
  winnerChosen(playerId, gameId, roundId) {
    const game = this.socket.room.getGameById(gameId);

    if (game && game.getRoundById(roundId)) {
      const round = game.getRoundById(roundId);
      const roundIndex = _.findIndex(game.rounds, {
        id: roundId
      });
      round.winnerChosen(playerId);
      this.socket.room.newMessage({
        username: 'Server',
        text: `Round ${ roundIndex + 1 } - ${ round.players[playerId].username } is the winner`,
        type: 'server'
      });

      this.updateRoom();
    }
  }


  //update all elements of the room after each action during the game
  updateRoom() {
    const {
      player,
      room
    } = this.socket;

    if (player && room) {
      const update = {
        name: room.name,
        messages: room.messages,
        games: room.games,
        players: room.players,
        thisPlayer: player,
        playerCount: room._playerCount,
        whiteCardsUsed: room._whiteCardsUsed,
        currentGame: room._currentGame,
        currentRound: room._currentGame ? room._currentGame._currentRound : null,
      };
      this.io.to(room.name).emit('updateroom', update);
    }
  }
}

module.exports = CahServer;