module.exports = io => {
  io.sockets.on('connection', socket => {
    console.log('kullanıcı bağlandı');

    socket.on('createClass', data => {
      let isRoom = true;
      Object.keys(socket.rooms).forEach(key => {
        if (key === data.classId) {
          console.log('bu id adında ders bulunmaktadır');
          console.log(socket.rooms);
          isRoom = false;
        }
      });
      if (isRoom === true)
        socket.join(data.classId, () => {
          console.log('ders olusturdunuz');
          console.log(socket.rooms);
        });
    });

    socket.on('deleteClass', data => {
      console.log(data);
      socket.leave(data.classId, () => {
        console.log('ders kaldırıldı');
      });
    });

    socket.on('approveClass', data => {
      console.log(data);
      if (io.sockets.adapter.rooms[data.classId] !== undefined)
        socket.join(data.classId, () => {
          socket.to(data.classId).emit('managerSend', {
            classId: data.classId,
            fullName: data.fullName,
            schoolNumber: data.schoolNumber
          });
        });
      else console.log('böyle bir ders bulunmamaktadır');
    });

    socket.on('disconnect', () => {
      console.log('kullanıcı ayrıldı');
    });
  });
};
