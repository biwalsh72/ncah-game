import React from 'react';
import ReactDOM from 'react-dom';
import  io  from 'socket.io-client';
import './css/room.scss';
import data from '../data.json';
import { App } from './components/index.js';

//connect socket client to host page
const socketIo = io.connect(window.location.host, { reconnect: true });

//render components of /app into socket for gameplay
ReactDOM.render(<App socket={ socketIo } data={ data } />, document.getElementById('app'));