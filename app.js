const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const http=require('http');
const socketio=require('socket.io');
const rateLimit = require("express-rate-limit");
const expressip = require('express-ip');

const UserController = require("./routes/UserController");
const ManagerController = require("./routes/ManagerController");
const StudentController = require("./routes/StudentController");
const AuthController = require("./routes/AuthController");

const respond = require("./helpers/respond");
const db = require("./helpers/db")();
const SystemError = require("./errors/SystemError");


const server=http.createServer((req,res)=>{
    res.end('socket baglantisi gerceklesti');
});
  
server.listen(3001);
const io=socketio.listen(server);
require('./helpers/socket')(io)

const app = express();
 
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message:"Too many accounts created from this IP, please try again after an hour" 
});

app.use(limiter);
app.use(expressip().getIpInfoMiddleware);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/user", UserController);
app.use("/manager", ManagerController);
app.use("/student", StudentController);
app.use("/auth", AuthController);


app.use(function (req, res) {
  console.log('IP: ', req.ipInfo);
  console.log('IP: ', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  respond.withError(res, SystemError.WrongEndPoint());
});

module.exports = app;