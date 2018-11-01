const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const UserController = require('./routes/UserController');
const ManagerController = require('./routes/ManagerController');
const StudentController = require('./routes/StudentController');
const AuthController = require('./routes/AuthController');
const respond = require('./helpers/respond');
const SystemError = require('./errors/SystemError');

const app = express();
const db=require('./helpers/db')();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/user', UserController);
app.use('/manager', ManagerController);
app.use('/student', StudentController);
app.use('/auth', AuthController);

app.use(function (req,res) {
    respond.withError(res, SystemError.BusinessException());
 });

module.exports = app;
