const _ = require('lodash');
const moment = require('moment');
const socket = require('socket.io-client')('http://localhost:3001/');
const Class = require('../models/Class');
const User = require('../models/Users');
const ClassRequest = require('../models/ClassRequest');
const RejectedRequest = require('../models/RejectedRequest');
const SystemError = require('../errors/SystemError');
const StudentError = require('../errors/StudentError');

const studentService = {};

studentService.getClasses = req =>
  new Promise((resolve, reject) => {
    let result = [];
    Class.find({})
      .then(classes => {
        const filteredClasses = classes

          .filter(classInstance => classInstance.lastJoinTime > moment().toDate())
          .filter(classInstance => classInstance.quota > classInstance.students.length);
        let callbacks = filteredClasses.length;
        filteredClasses.forEach(classInstance => {
          ClassRequest.findOne({
            classId: classInstance._id,
            studentId: req.tokenData.userId
          })
            .then(classReq => {
              RejectedRequest.findOne({
                classId: classInstance._id,
                studentId: req.tokenData.userId
              })
                .then(rejectedReq => {
                  Class.findOne({ _id: classInstance._id })
                    .then(classLastInstance => {
                      if (
                        !classLastInstance.students.find(
                          student => student.userId === req.tokenData.userId
                        ) &&
                        !classReq &&
                        !rejectedReq
                      ) {
                        result.push(classInstance);
                        callbacks--;
                      } else callbacks--;

                      if (callbacks === 0) {
                        result = result.map(x =>
                          _.pick(x, [
                            '_id',
                            'managerId',
                            'className',
                            'joinTime',
                            'quota',
                            'discontinuity',
                            'description',
                            'managerName',
                            'lastJoinTime'
                          ])
                        );
                        return resolve(result);
                      }
                    })
                    .catch(err => reject(SystemError.BusinessException(err)));
                })
                .catch(err => reject(SystemError.BusinessException(err)));
            })
            .catch(err => reject(SystemError.BusinessException(err)));
        });
      })
      .catch(err => reject(SystemError.BusinessException(err)));
  });

studentService.getRequestClasses = req =>
  new Promise((resolve, reject) => {
    ClassRequest.find({ studentNumber: req.tokenData.schoolNumber })
      .then(res => resolve(res))
      .catch(err => reject(SystemError.BusinessException(err)));
  });

studentService.getUserClasses = req =>
  new Promise((resolve, reject) => {
    Class.find({ 'students.schoolNumber': req.tokenData.schoolNumber })
      .then(res => {
        const result = res.map(x =>
          _.pick(x, [
            '_id',
            'managerId',
            'className',
            'joinTime',
            'quota',
            'discontinuity',
            'description',
            'managerName'
          ])
        );
        return resolve(result);
      })
      .catch(err => reject(SystemError.BusinessException(err)));
  });

studentService.joinClass = req =>
  new Promise((resolve, reject) => {
    ClassRequest.find({
      classId: req.params.id,
      studentId: req.tokenData.userId
    })
      .then(res => {
        // Check class for student request
        if (res.length > 0) return reject(StudentError.StudentAlreadyRequested());

        RejectedRequest.find({
          classId: req.params.id,
          studentId: req.tokenData.userId
        })
          .then(rejected => {
            // Check class for student request
            if (rejected.length > 0) return reject(StudentError.Rejected());

            Class.findOne({ _id: req.params.id })
              .then(classInstance => {
                if (classInstance.lastJoinTime < moment().toDate())
                  return reject(StudentError.Expired());
                const studentId = classInstance.students.find(
                  student => student.userId === req.tokenData.userId
                );
                // Check class for student
                if (studentId) return reject(StudentError.StudentAlreadyJoin());

                if (classInstance.quota === classInstance.students.length)
                  return reject(StudentError.ClassFull()); // Check class quota

                User.findOne({ _id: req.tokenData.userId })
                  .then(userInstance => {
                    const classReq = new ClassRequest({
                      managerId: classInstance.managerId,
                      managerName: classInstance.managerName,
                      classId: req.params.id,
                      className: classInstance.className,
                      studentId: req.tokenData.userId,
                      studentName: userInstance.fullName,
                      studentNumber: req.tokenData.schoolNumber,
                      requestDate: moment().toDate()
                    });

                    classReq
                      .save()
                      .then(instance => resolve(instance))
                      .catch(err => reject(SystemError.BusinessException(err)));
                  })
                  .catch(err => reject(SystemError.BusinessException(err)));
              })
              .catch(err => reject(SystemError.BusinessException(err)));
          })
          .catch(err => reject(SystemError.BusinessException(err)));
      })
      .catch(err => reject(SystemError.BusinessException(err)));
  });

studentService.joinRollCall = req =>
  new Promise((resolve, reject) => {
    const classId = req.params.classId;
    const qhereId = req.params.qhereId;
    const studentId = req.tokenData.userId;

    User.findOne({ _id: studentId })
      .then(userInstance => {
        Class.findOne({ _id: classId })
          .then(classInstance => {
            if (!classInstance.students.find(student => student.userId === studentId))
              return reject(StudentError.notInClass());

            const qhereInstance = classInstance.qheres.find(qhere => qhere._id === qhereId);

            if (qhereInstance.students.find(student => student._id === studentId))
              return reject(StudentError.StudentAlreadyJoinRollCall());

            qhereInstance.students.push(userInstance);
            classInstance.qheres[qhereInstance.number - 1] = qhereInstance;
            Class.findOneAndUpdate(
              { _id: classId },
              { qheres: classInstance.qheres },
              { new: true }
            )
              .then(updatedClass => {
                socket.emit('approveClass', {
                  classId,
                  fullName: userInstance.fullName,
                  schoolNumber: userInstance.schoolNumber
                });
                return resolve(updatedClass);
              })
              .catch(err => reject(err));
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });

studentService.getDiscontinuity = req =>
  new Promise((resolve, reject) => {
    const classId = req.params.classId;
    const schoolNumber = req.tokenData.schoolNumber;
    let qhereCount = 0;
    const weeksInfo = [];
    Class.findOne({ _id: classId })
      .then(classInstance => {
        classInstance.qheres.forEach(qhere => {
          qhereCount++;
          qhere.students.find(student => {
            student.schoolNumber === schoolNumber
              ? weeksInfo.push({ weekNumber: qhereCount })
              : null;
          });
        });
        const discontinuity = {
          qhereCount,
          rollCall: weeksInfo.length,
          weeksInfo
        };
        return resolve(discontinuity);
      })
      .catch(err => reject(SystemError.BusinessException(err)));
  });

studentService.readNotification = req =>
  new Promise((resolve, reject) => {
    User.findOneAndUpdate(
      {
        $and: [{ _id: req.tokenData.userId }, { 'notification._id': req.body.id }]
      },
      { $set: { 'notification.$.isRead': 'true' } },
      { new: true }
    )
      .then(instance => {
        instance.notification.map(not => {
          if (JSON.stringify(not._id) === `"` + req.body.id + `"`) return resolve(not);
        });
      })
      .catch(err => reject(err));
  });

studentService.getNotification = req =>
  new Promise((resolve, reject) => {
    User.findOne({ _id: req.tokenData.userId })
      .then(instance => {
        resolve(instance.notification);
      })
      .catch(err => reject(err));
  });

module.exports = studentService;
