import React from 'react';
var createReactClass = require('create-react-class');

const ChooseWinnerButton = createReactClass({
  onClick() {
    this.props.onClick(this.props.playerId);
  },

  render() {
    const { user, currentRound } = this.props;
    if (user.id !== currentRound.czarId) { return null; }
    if (_.keys(currentRound.chosenWhiteCards).length !== (currentRound.playerIds.length - 1)) { return null; }
    if (currentRound.winnerId !== null) { return null; }

    return <button type="text" onClick={ this.onClick }>Choose Winner</button>;
  }
});

export default ChooseWinnerButton;
