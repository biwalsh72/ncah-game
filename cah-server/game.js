const _ = require('lodash');
const Round = require('./round.js');

//Defining all actions that occur over the course of multiple rounds
class Game {
  constructor(players) {
    this.players = players;
    this.id = _.uniqueId(Math.floor(Date.now() / 1000));
    this.rounds = [];
    this.newRound(this.players);
  }

  get _whiteCardsUsed() {
    return _.uniq(_.flatMap(this.rounds, (round) => {
      return round.whiteCardsUsed;
    }));
  }

  get _blackCardsUsed() {
    return _.uniq(_.flatMap(this.rounds, (round) => {
      return round.blackCardsUsed;
    }));
  }

  get _previousCzar() {
    return _.last(this.rounds) ? _.last(this.rounds).czarId : undefined;
  }

  get _currentRound() {
    return _.last(this.rounds);
  }

  playerLeft(playerId) {
    this._currentRound.playerLeft(playerId);
  }

  playerJoined(playerId) {
    this._currentRound.playerJoined(playerId);
  }

  getRoundById(id) {
    return this.rounds.find(r => r.id === id);
  }

  newRound(players) {
    const round = new Round(this.id, players, this._whiteCardsUsed, this._blackCardsUsed, this._previousCzar);
    this.rounds.push(round);
    return round;
  }
}

module.exports = Game;
