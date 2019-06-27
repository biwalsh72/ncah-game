const _ = require('lodash');
let Player = require('../cah-server/player.js');
let Game = require('../cah-server/game.js');
let chai = require('chai');

var should = require('should');
//chai.should();

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
        //should.exist(game.rounds.length);
        //game.rounds.length.should.equal(1);
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
            //should.exist(game.rounds.length);
            //game.rounds.length.should.equal(2);
            should(game.rounds.length).equal(2);
        });

        it('assigns new cards for each player', () => {
            //should.exist(secondRound.whiteCardsUsed.length);
            //secondRound.whiteCardsUsed.length.should.equal(
            //    firstRound.whiteCardsUsed.length + (firstRound.blackCard.pick * _.keys(players).length)
            // );
            should(secondRound.whiteCardsUsed.length).equal(firstRound.whiteCardsUsed.length + (firstRound.blackCard.pick * _.keys(players).length));
        });

        it('assigns a new judge', () => {
            //should.exist(secondRound.czarId);
            //secondRound.czarId.should.not.equal('player1');
            should(secondRound.czarId).not.equal('player1');
        });

        it('assigns a new black card', () => {
            //should.exist(secondRound.blackCardsUsed.length);
            //secondRound.blackCardsUsed.length.should.equal(2);
            should(secondRound.blackCardsUsed.length).equal(2);
        });
    });

    describe('#getRoundById', () => {
        let round;

        beforeEach(() => {
            round = game.newRound(players);
        });

        it('returns the correct round', () => {
            //should.exist(game.getRoundById(round.id));
            //game.getRoundById(round.id).should.equal(round);
            should(game.getRoundById(round.id)).equal(round);
        });

    });

});