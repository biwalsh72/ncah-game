const _ = require('lodash');
let Player = require('../cah-server/player.js');
let Game = require('../cah-server/game.js');
let chai = require('chai');

var should = require('should');

describe('Game', () => {
    let players;
    let game;

    beforeEach(() => {
        players = {
            player1: new Player('player1', 'john'),
            player2: new Player('player2', 'smith')
        };

        game = new Game(players);
    });

    it('starts a new round after creation', () => {
        should(game.rounds.length).be.exactly(1);
    });

    describe('#newRound', () => {
        let firstRound;
        let secondRound;

        beforeEach(() => {
            firstRound = game.rounds[0];

            _.forEach(firstRound.players, (player, playerId) => {
                let choiceCount = 0;
                let choices = [];

                while (choiceCount < firstRound.blackCard.pick) {
                    choices.push(player.cards[choiceCount].index);
                    choiceCount++;
                }

                firstRound.playerSubmitted(playerId, choices);
            });

            firstRound.winnerChosen('player1');
            secondRound = game.newRound(players);
        });

        it('creates a new round in the game', () => {
            should(game.rounds.length).equal(2);
        });

        it('assigns new cards for each player', () => {
            should(secondRound.whiteCardsUsed.length).equal(firstRound.whiteCardsUsed.length + (firstRound.blackCard.pick * _.keys(players).length));
        });

        it('assigns a new Czar', () => {
            should(secondRound.czarId).not.equal('player1');
        });

        it('assigns a new black card', () => {
            should(secondRound.blackCardsUsed.length).equal(2);
        });
    });

    describe('#getRoundById', () => {
        let round;

        beforeEach(() => {
            round = game.newRound(players);
        });

        it('returns the correct round', () => {
            should(game.getRoundById(round.id)).equal(round);
        });

    });

});