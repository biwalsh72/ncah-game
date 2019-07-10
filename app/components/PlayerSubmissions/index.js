import React from 'react';
import _ from 'lodash';
import { Card, ChooseWinnerButton } from '../';
var createReactClass = require('create-react-class');
import styles from './style.scss';

//rendering cards submitted by players each round
const PlayerSubmissions = createReactClass({
  renderPlayerSubmission(cardIndex, index) {
    const { data } = this.props;
    const card = {
      index: cardIndex,
      text: data.whiteCards[cardIndex]
    };

    return (
      <Card
        key={ index }
        colour="white"
        card={ card } />
    );
  },

  renderSubmission(player, playerId, index) {
    const { currentRound, user } = this.props;
    if (!currentRound.chosenWhiteCards[player.id]) { return null; }

    return (
      <div className="submission" key={ playerId } style={{"order": currentRound.chosenWhiteCards[playerId][0]}}>
        <div className="chosen-cards">
          { currentRound.chosenWhiteCards[playerId].map(this.renderPlayerSubmission) }
        </div>
        <ChooseWinnerButton
          { ...this.props }
          playerId={ playerId }
          onClick={ this.chooseWinner } />
      </div>
    );
  },

  chooseWinner(playerId) {
    const { currentGame, currentRound } = this.props;
    this.props.socket.emit('winner-chosen', playerId, currentGame.id, currentRound.id);
  },

  render() {
    return (
      <div className={ styles.playerSubmissions }>
        { _.map(this.props.currentRound.players, this.renderSubmission) }
      </div>
    );
  }
});

export default PlayerSubmissions;
