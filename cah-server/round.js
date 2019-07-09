const _ = require('lodash');
const data = require('../data.json');

//Defining all rules/actions that occur during each round of the game
class Round {
  constructor(gameId, players = {}, whiteCardsUsed = [], blackCardsUsed = [], previousCzar) {
    this.gameId = gameId;
    this.id = _.uniqueId(Math.floor(Date.now() / 1000));
    this.players = players;
    this.playerIds = _.map(this.players, (p => p.id));
    this.whiteCardsUsed = [...whiteCardsUsed];
    this.blackCardsUsed = [...blackCardsUsed];
    this.previousCzar = previousCzar;

    // Temporary fix to avoid crashing
    this.gameInterrupt = false;

    this.chosenWhiteCards = {};
    this.winnerId = null;
    this.czarId = null;

    this.allocateWhiteCards();
    this.allocateBlackCard();
    this.assignCzar();
  }

  get _blackCardIndex() {
    return this.blackCard.index;
  }

  playerLeft(playerId) {
    console.log("playerLeft " + playerId);
    this.gameInterrupt = true;

    const player = this.players[playerId];
    console.log('gameID' + this.gameId);

    this.playerId = null;

    delete this.players[playerId]; 
    this.playerIds = _.map(this.players, (p) => {
      return p.id;
    });

    console.log(Object.keys(this.players));

    //console.log(this.players);

    //console.log('playerIDs that are left ' + this.playerIds);

    if (this.czarId === playerId) {
      this.czarId = null;
      //this.playerId = null;
      this.assignCzar(); //////////////////bug happening here need to make sure that the player that left is no longer the card czar
    }
  }

  playerJoined(player) {
    console.log("playerJoined: " + JSON.stringify(player));

    //if (!this.gameInterrupt) { ------temp fix
    this.players[player.id] = player;
    this.playerIds.push(player.id);
    this.allocateWhiteCards();
    //}
  }

  assignCzar() {
    if (!this.previousCzar) {
      this.czarId = this.playerIds[0];
    } else {
      const nextCzarIndex = this.playerIds.indexOf(this.previousCzar) + 1;
      if (this.playerIds[nextCzarIndex]) {
        this.czarId = this.playerIds[nextCzarIndex];
      } else {
        this.czarId = this.playerIds[0];
      }
    }
  }

  getWhiteCard() {
    const whiteCards = data.whiteCards;
    const index = _.random(0, whiteCards.length - 1)

    if (this.whiteCardsUsed.includes(index)) {
      return this.getWhiteCard();
    }

    return index;
  }

  allocateBlackCard() {
    const blackCards = data.blackCards;
    const index = _.random(0, blackCards.length - 1)

    if (this.blackCardsUsed.includes(index)) {
      return this.allocateBlackCard();
    }

    this.blackCardsUsed.push(index);
    this.blackCard = {
      index: index,
      text: blackCards[index].text,
      pick: blackCards[index].pick
    }
  }

  playerSubmitted(playerId, choices) {
    this.chosenWhiteCards[playerId] = choices;
  }

  winnerChosen(playerId) {
    this.winnerId = playerId;

    _.forEach(this.chosenWhiteCards, (choices, playerId) => {
      const player = this.players[playerId];
      choices.forEach((choice) => {
        const choiceIndex = _.findIndex(player.cards, {
          index: choice
        });
        player.cards.splice(choiceIndex, 1);
      });
    });
  }

  allocateWhiteCards() {
    _.forEach(this.players, this.allocateWhiteCardsForPlayer.bind(this));
  }

  allocateWhiteCardsForPlayer(player, playerId) {
    const whiteCards = data.whiteCards;
    if (!player && !player.cards) {
      player.cards = [];
    }

    if (player.cards) {
      while (player.cards.length < 10) {
        const cardIndex = this.getWhiteCard();
        this.whiteCardsUsed.push(cardIndex);

        const card = {
          index: cardIndex,
          text: whiteCards[cardIndex]
        }

        player.addWhiteCard(card);
      }
    }

  }
}

module.exports = Round;