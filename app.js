const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const requestIp = require('request-ip');
const helmet = require('helmet');

const UserController = require('./routes/UserController');
const ManagerController = require('./routes/ManagerController');
const StudentController = require('./routes/StudentController');
const AuthController = require('./routes/AuthController');

const respond = require('./helpers/respond');
const db = require('./helpers/db');
const SystemError = require('./errors/SystemError');

db();
const server = http.createServer((req, res) => {
  res.end('socket baglantisi gerceklesti');
});

server.listen(3001);
const io = socketio.listen(server);
require('./helpers/socket')(io);

const app = express();

app.enable('trust proxy');

app.use(
  helmet({
    frameGuard: {
      action: 'deny'
    }
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(cors());

app.use('/qhere/user', UserController);
app.use('/qhere/manager', ManagerController);
app.use('/qhere/student', StudentController);
app.use('/qhere/auth', AuthController);

app.use(requestIp.mw());
app.use((req, res, next) => {
  console.log('IP Address: ', req.clientIp);
  next();
});

app.use((req, res) => {
  respond.withError(res, SystemError.WrongEndPoint());
});

module.exports = app;
