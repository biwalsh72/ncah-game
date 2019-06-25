import React from 'react';
import { PlayerSubmissions, Card } from '../';
var createReactClass = require('create-react-class');

const StageRight = createReactClass({
  renderPlayerCard(card, index) {
    const { onWhiteCardSelected, selectedCards } = this.props;
    return (
      <Card
        key={ index }
        colour="white"
        card={ card }
        isSelected={ selectedCards.includes(card.index) }
        onClick={ onWhiteCardSelected } />
    );
  },

  renderContent() {
    const { user, currentRound, currentUser } = this.props;

    if (currentRound.czarId === user.id || currentRound.chosenWhiteCards[user.id]) {
      return <PlayerSubmissions { ...this.props } />;
    }

    return user.cards.map(this.renderPlayerCard);
  },

  render() {
    return (
      <div className="col-right">
        { this.renderContent() }
      </div>
    );
  }
});

export default StageRight;
