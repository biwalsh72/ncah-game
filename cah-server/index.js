const _ = require('lodash');
const Room = require('./room.js');
const Player = require('./player.js');
const {
  cleanString,
  urlifyText
} = require('../utils');

class CahServer {
  constructor(io) {
    this.io = io;
    this.rooms = {};
  }

  init(socket) {
    this.socket = socket;
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

  userJoined(roomName) {
    console.log("userJoined room " + roomName);
    this.rooms[roomName] = this.rooms[roomName] || new Room(roomName);
    this.socket.room = this.rooms[roomName];
    this.socket.join(roomName);
    this.updateRoom();
  }

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

  userLeft(reason) {

    console.log('reason: ' + reason);

    if (this.socket.room && this.socket.player && this.socket.player.username !== undefined) {
      console.log('ROOMNAME ' + this.socket.room.name);
      console.log('PLAYERNAME ' + this.socket.player.username);

      //maybe save this info into a cookie to retrieve on the menu?

      this.socket.room.playerLeft(this.socket.player.id);


      console.log('user ' + this.socket.player.username + ' left the room ' + this.socket.room.name);

      this.updateRoom();

      //this.socket.emit('disconnected');
      //this.socket.player.disconnect();

      ///////////add if playercount < 3 restart the game(room)

      
      //if (this.socket.room._playerCount > 2) {
      if (this.socket.room._playerCount < 3) {
        console.log('Less than 3 players are in the current game. Restarting.');
        this.updateRoom();

        this.socket.room.newMessage({
          username: 'Server',
          text: `<strong>A player left, starting a new game.</strong>`,
          type: 'server'
        });

        this.startGame();

      }
      else if (this.socket.room._playerCount === 0) {
        this.startGame();
      }
    }
  }

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

      this.socket.player = newPlayer;
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

    if (this.socket.room._currentGame) {

      
    }
  }

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

  startGame() {
    this.socket.room.newGame();
    this.displayNextCzar();
    this.updateRoom();
  }

  displayNextCzar() {
    const {
      room
    } = this.socket;
    if (room._currentGame.rounds.length && room._currentCzar.username) {
      room.newMessage({
        username: 'Server',
        text: `Round ${ room._currentGame.rounds.length } - ${ room._currentCzar.username } is the Czar`,
        type: 'server'
      });
    }

  }

  nextRound(gameId) {
    const {
      room
    } = this.socket;

    //if (gameId && room) {
    const game = room.getGameById(gameId);
    game.newRound(room.players);
    this.displayNextCzar();

    this.updateRoom();
    //}

  }

  playerSubmitted(gameId, roundId, playerId, choices) {
    const game = this.socket.room.getGameById(gameId);

    if (game.getRoundById(roundId)) {
      const round = game.getRoundById(roundId);
      round.playerSubmitted(playerId, choices);

      this.updateRoom();
    }
  }

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