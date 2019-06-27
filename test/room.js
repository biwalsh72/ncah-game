const _ = require('lodash');
let Room = require('../cah-server/room.js');
let chai = require('chai');

var should = require('should');

describe('Room', () => {
    let room;

    beforeEach(() => {
        room = new Room('test');
    });

    describe('#_playerCount', () => {
        beforeEach(() => {
            room.addPlayer({
                id: 'test',
                username: 'billson'
            });
            room.addPlayer({
                id: 'test2',
                username: 'james'
            });
        });

        it('returns the number of players in the room', () => {
            should(room._playerCount).equal(2);
        });
    });

    describe('#_currentGame', () => {
        let firstGame;
        let secondGame;

        beforeEach(() => {
            firstGame = room.newGame();
            secondGame = room.newGame();
        });

        it('returns the current game', () => {
            should((room._currentGame)).equal(secondGame);
        });
    });

    describe('#_whiteCardsUsed', () => {
        let firstGame;
        let secondGame;

        beforeEach(() => {
            firstGame = room.newGame();
            secondGame = room.newGame();
        });

        it('returns the current game', () => {
            should(room._currentGame).equal(secondGame);
        });
    });

    describe('#newGame', () => {
        beforeEach(() => {
            room.newGame();
        });

        it('creates a new game', () => {
            should(room.games.length).equal(1);
        });
    });

    describe('#newMessage', () => {
        beforeEach(() => {
            room.newMessage({
                username: 'johnny',
                text: 'hi there',
                type: 'chat'
            });
        });

        it('adds a new message to the room', () => {
            should(room.messages.length).equal(1);
        });
    });

    describe('#getGameById', () => {
        let firstGame;
        let secondGame;

        beforeEach(() => {
            firstGame = room.newGame();
            secondGame = room.newGame();
        });

        it('returns the correct game', () => {
            should(room.getGameById(firstGame.id)).equal(firstGame);
        });
    });


    describe('#addPlayer', () => {
        beforeEach(() => {
            room.addPlayer({
                id: 'test',
                username: 'billson'
            });
        });

        it('adds the player to the room', () => {
            should(Object.keys(room.players).length).equal(1);
        });

        it('only adds the player once', () => {
            room.addPlayer({
                id: 'test',
                username: 'billson'
            });
            should(Object.keys(room.players).length).equal(1);
        });
    });
});