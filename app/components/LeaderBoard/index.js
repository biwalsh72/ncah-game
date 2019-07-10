import React from 'react';
import styles from './style.scss';
import './style.scss';
var createReactClass = require('create-react-class');

//rendering LeaderBoard for all players
const LeaderBoard = createReactClass({
  renderRow({ playerId, score }, i) {
    const { players } = this.props;

    return (
      <li key={ i }>
        <span className="player">
          { players[playerId].username }
        </span>
        { score }
      </li>
    );
  },

  getResults() {
    const { game, players } = this.props;

    const scores = _.map(players, (player, playerId) => {
      return {
        playerId: playerId,
        score: game.rounds.filter(r => r.winnerId === playerId).length
      };
    });

    return _.orderBy(scores, ['score'], ['desc']).map(this.renderRow);
  },

  render() {
    return (
      <div className={ styles.leaderboard }>
        <h4>Leaderboard</h4>
        <ul>{ this.getResults() }</ul>
      </div>
    );
  }
});

export default LeaderBoard;
