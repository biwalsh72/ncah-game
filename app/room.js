import React from 'react';
import ReactDOM from 'react-dom';
import  io  from 'socket.io-client';
import './css/room.scss';
import data from '../data.json';
import { App } from './components/index.js';

const render = ReactDOM.render;
const socketIo = io.connect(window.location.host, { reconnect: true });

render(<App socket={ socketIo } data={ data } />, document.getElementById('app'));
