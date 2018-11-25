const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const http=require('http');
const socketio=require('socket.io');

const UserController = require("./routes/UserController");
const ManagerController = require("./routes/ManagerController");
const StudentController = require("./routes/StudentController");
const AuthController = require("./routes/AuthController");

const respond = require("./helpers/respond");
const db = require("./helpers/db")();
const SystemError = require("./errors/SystemError");

const app = express();

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

const server=http.createServer((req,res)=>{
  res.end('socket baglantisi gerceklesti');
});

server.listen(3001);

const io=socketio.listen(server);

io.sockets.on('connection',(socket)=>{
  console.log('kullanıcı bağlandı');

  socket.on('createClass',(data)=>{
      let isRoom=true;
      Object.keys(socket.rooms).forEach(key => {
          if(key===data.classId){
              console.log("bu id adında ders bulunmaktadır")
              console.log(socket.rooms)
              isRoom=false
          }
      });
      if(isRoom===true){
          socket.join(data.classId,()=>{  
              console.log("ders olusturdunuz");
              console.log(socket.rooms)
          })
      }
  });

  socket.on('deleteClass',(data)=>{
      console.log(data);
      socket.leave(data.classId,()=>{
          console.log("ders kaldırıldı");
      });
  })

  socket.on('approveClass',(data)=>{
            console.log(data);
          if(io.sockets.adapter.rooms[data.classId]!==undefined)
          {
              socket.join(data.classId ,()=>{
                  socket.to(data.classId).emit('managerSend',{ classId:data.classId, fullName:data.fullName,schoolNumber:data.schoolNumber });
              });
          }else{
              console.log("böyle bir ders bulunmamaktadır")
          }
  });

  socket.on('disconnect',()=>{
      console.log('kullanıcı ayrıldı');
  });
});


app.use(function (req, res) {
  respond.withError(res, SystemError.BusinessException());
});

module.exports = app;