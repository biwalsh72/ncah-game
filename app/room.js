import React from 'react';
import ReactDOM from 'react-dom';
import  io  from 'socket.io-client';
import './css/room.scss';
import data from '../data.json';
import { App } from './components/index.js';

//render variable is required after update to React v16
const render = ReactDOM.render;

//connect socket client to host page
const socketIo = io.connect(window.location.host, { reconnect: true });

//render components of /app into socket for gameplay
render(<App socket={ socketIo } data={ data } />, document.getElementById('app'));
