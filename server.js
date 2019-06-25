const CahServer = require('./cah-server');
const isProduction = process.env.NODE_ENV === 'production';
const _ = require('lodash');
const port = process.env.PORT || 3000;
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const configDB = require('./config/database.js');
const session = require('express-session');
const flash = require('connect-flash');
const socketioAuth = require('socketio-auth');
const morgan = require('morgan');
const ejs = require('ejs');
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  pingTimeout: 30000,
  pingInterval: 60000,
  upgradeTimeout: 50000
});
const {
  cleanString,
  urlifyText
} = require('./utils');
const data = require('./data.json');
const rooms = {};
// or
var util = require('util');

mongoose.connect(configDB.url, {
  useNewUrlParser: true
});

require('./config/passport')(passport);

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
  extended: true
}));


app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
});

app.use(session({
  secret: 'bitchwhatareyousaying', // session secret
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var numUsers = 0;

require('./app/routes.js')(app, passport);


app.use(express.static('public'));
app.use('/:id', express.static(path.resolve('build')));


const cahServer = new CahServer(io);
io.on('connection', (socket) => {
  cahServer.init(socket);

  let rooms = io.sockets.adapter.rooms;
  console.log(rooms);

  socket.on('disconnect', function (reason) {
    console.log('Socket disconnected! ' + reason);
  });

  socket.on('greet', function (data) {
    socket.emit('respond', data);
    console.log('GREET RECEIVED from ' + data);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



if (!isProduction) {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const webpackConfig = require('./webpack.config.js');

  new WebpackDevServer(webpack(webpackConfig), {
    hot: true,
    noInfo: true,
    quiet: false,
    publicPath: '/build/',
    proxy: {
      '*': 'http://localhost:3000'
    },
    stats: {
      colors: true
    },
  }).listen(8080, 'localhost', err => {
    if (err) console.log(err);
    console.log('Webpack Dev Server listening at 8080');
  });
}
