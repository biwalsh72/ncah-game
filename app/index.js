import $ from 'jquery';
import './css/index.scss';

$(() => {
  const $body = $('body');
  const $startForm = $body.find('#start-form');
  const $input = $startForm.find('input');

  //input form to create game
  $startForm.on('submit', (evt) => {
    evt.preventDefault();
    const value = $input.val().replace(/\s+/g, '-').toLowerCase();

    window.location.href = '/room/' + value;
  });
});
