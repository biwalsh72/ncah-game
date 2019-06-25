import React from 'react';
import './style.scss';
var createReactClass = require('create-react-class');

const StageHeader = createReactClass({
  renderJudgeText(round, user) {
    if (round && round.czarId !== user.id) {
      return null;
    }

    return <p className="judge-text">You are the Czar!</p>;
  },

  render() {
    const { currentGame, currentRound, user } = this.props;

    return (
      <div className="header">
        <p className="round">Round { currentGame.rounds.length }</p>
        { this.renderJudgeText(currentRound, user) }
        <p className="player">{ user.username }</p>
      </div>
    );
  }
});

export default StageHeader;
