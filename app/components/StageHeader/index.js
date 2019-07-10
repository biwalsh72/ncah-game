import React from 'react';
import './style.scss';
var createReactClass = require('create-react-class');

//banner at the top of the page or text for card czar during each round
const StageHeader = createReactClass({
  renderCzarText(round, user) {
    if (round && round.czarId !== user.id) {
      return null;
    }

    return <p className="Czar-text">You are the Czar!</p>;
  },

  render() {
    const { currentGame, currentRound, user } = this.props;

    return (
      <div className="header">
        <p className="round">Round { currentGame.rounds.length }</p>
        { this.renderCzarText(currentRound, user) }
        <p className="player">{ user.username }</p>
      </div>
    );
  }
});

export default StageHeader;
