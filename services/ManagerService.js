/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
const moment = require('moment');
const Class = require('../models/Class');
const User = require('../models/Users');
const ClassesRequest = require('../models/ClassRequest');
const RejectedRequest = require('../models/RejectedRequest');
const ManagerError = require('../errors/ManagerError');
const SystemError = require('../errors/SystemError');

const ManagerService = {};

ManagerService.createClass = req =>
  new Promise((resolve, reject) => {
    User.findOne({ _id: req.tokenData.userId })
      .then(userInstance => {
        const { className, lastJoinTime, quota, discontinuity, description } = req.body;
        const createClass = Class({
          managerId: req.tokenData.userId,
          className,
          lastJoinTime,
          quota,
          discontinuity,
          description,
          managerName: userInstance.fullName
        });
        createClass
          .save()
          .then(classInstance => resolve(classInstance))
          .catch(err => reject(SystemError.BusinessException(err)));
      })
      .catch(err => reject(SystemError.BusinessException(err)));
  });

ManagerService.approveStudents = req =>
  new Promise((resolve, reject) => {
    ClassesRequest.findOne({
      $and: [{ _id: req.params.id }, { managerId: req.tokenData.userId }]
    })
      .then(approveStudent => {
        if (approveStudent == null) return reject(ManagerError.ClassRequestNotFound());

        User.findOne({ _id: approveStudent.studentId })
          .then(instance => {
            const newStudent = {
              userId: instance._id,
              fullName: instance.fullName,
              schoolNumber: instance.schoolNumber,
              email: instance.email
            };
            Class.findOneAndUpdate(
              { _id: approveStudent.classId },
              {
                $push: {
                  students: newStudent
                }
              },
              { new: true }
            )
              .then(classInstance => {
                ClassesRequest.findOneAndDelete({ _id: req.params.id })
                  .then(() => resolve(classInstance))
                  .catch(err => reject(SystemError.BusinessException(err)));
              })
              .catch(err => reject(err));
          })
          .catch(err => reject(SystemError.BusinessException(err)));
      })
      .catch(err => reject(SystemError.BusinessException(err)));
  });

ManagerService.rejectStudents = req =>
  new Promise((resolve, reject) => {
    ClassesRequest.findOneAndDelete({
      $and: [{ _id: req.params.id }, { managerId: req.tokenData.userId }]
    })
      .then(rejectStudent => {
        if (rejectStudent == null) return reject(ManagerError.BadRequest());

        const rejectedStudent = RejectedRequest({
          classId: rejectStudent.classId,
          className: rejectStudent.className,
          studentId: rejectStudent.studentId,
          studentName: rejectStudent.studentName
        });
        rejectedStudent
          .save()
          .then(rejectInstance => resolve(rejectInstance))
          .catch(err => reject(SystemError.BusinessException(err)));
      })
      .catch(err => reject(SystemError.BusinessException(err)));
  });

ManagerService.getClasses = req =>
  new Promise((resolve, reject) => {
    Class.find({ managerId: req.tokenData.userId })
      .then(classes => resolve(classes))
      .catch(() => reject(ManagerError.BadRequest()));
  });

ManagerService.getClassInfo = req =>
  new Promise((resolve, reject) => {
    Class.find({
      $and: [{ _id: req.params.id }, { managerId: req.tokenData.userId }]
    })
      .then(classInstance => {
        if (classInstance.length == 0) return reject(ManagerError.BadRequest());

        classInstance[0].students.find(instance => {
          let discontinuity = 0;
          classInstance[0].qheres.forEach(qhere => {
            const isEmpty = qhere.students.filter(
              student => instance.userId == student._id.toString()
            );
            if (isEmpty.length !== 0) discontinuity++;
          });
          Class.findOneAndUpdate(
            {
              $and: [
                { _id: req.params.id },
                { managerId: req.tokenData.userId },
                { 'students.userId': instance.userId }
              ]
            },
            { $set: { 'students.$.studentDiscontinuity': discontinuity } },
            { new: true }
          ).then(() => {});
        });
        Class.find({ $and: [{ _id: req.params.id }, { managerId: req.tokenData.userId }] }).then(
          resolve(classInstance)
        );
      })
      .catch(() => reject(ManagerError.BadRequest()));
  });

ManagerService.getClassesRequest = req =>
  new Promise((resolve, reject) => {
    ClassesRequest.find({ managerId: req.tokenData.userId })
      .then(students => resolve(students))
      .catch(err => reject(err));
  });

ManagerService.deleteClass = req =>
  new Promise((resolve, reject) => {
    Class.findOneAndDelete({
      $and: [{ _id: req.params.id }, { managerId: req.tokenData.userId }]
    })
      .then(classInstance => {
        if (classInstance == null)
          return reject(SystemError.BusinessException('Böyle bir ders bulunmamaktadır.'));

        return resolve(classInstance);
      })
      .catch(() => reject(ManagerError.BadRequest()));
  });

ManagerService.updateClass = req =>
  new Promise((resolve, reject) => {
    Class.findOneAndUpdate(
      { $and: [{ _id: req.params.id }, { managerId: req.tokenData.userId }] },
      req.body,
      { new: true }
    )
      .then(instance => {
        if (instance == null) return reject(ManagerError.BadRequest());

        return resolve(instance);
      })
      .catch(() => reject(ManagerError.BadRequest()));
  });

ManagerService.createQr = req =>
  new Promise((resolve, reject) => {
    Class.findOne({
      $and: [{ _id: req.body.classId }, { managerId: req.tokenData.userId }]
    })
      .then(instance => {
        if (instance == null || instance.qheres.length == 15)
          return reject(ManagerError.BadRequest());

        Class.findOneAndUpdate(
          { _id: req.body.classId },
          { $push: { qheres: { number: instance.qheres.length + 1 } } },
          { new: true }
        )
          .then(updateInstance => resolve(updateInstance))
          .catch(err => reject(SystemError.BusinessException(err)));
      })
      .catch(err => reject(SystemError.BusinessException(err)));
  });

ManagerService.finishQhere = req =>
  new Promise((resolve, reject) => {
    Class.findOne({ _id: req.body.classId })
      .then(classInstance => {
        if (!classInstance) return reject(SystemError.BusinessException());

        const qhereInstance = classInstance.qheres[classInstance.qheres.length - 1];
        qhereInstance.isActive = false;
        classInstance.qheres[qhereInstance.number - 1] = qhereInstance;

        Class.findOneAndUpdate(
          { _id: req.body.classId },
          { qheres: classInstance.qheres },
          { new: true }
        )
          .then(() => {
            return resolve(qhereInstance);
          })
          .catch(err => {
            return reject(err);
          });
      })
      .catch(err => {
        return reject(err);
      });
  });

ManagerService.getQrInfo = req =>
  new Promise((resolve, reject) => {
    Class.findOne({
      $and: [{ 'qheres._id': { _id: req.params.id } }, { managerId: req.tokenData.userId }]
    })
      .then(qrInstance => {
        if (qrInstance == null) return reject(ManagerError.BadRequest());
        qrInstance.qheres.find(qhere => {
          if (JSON.stringify(qhere._id) == JSON.stringify(req.params.id)) return resolve(qhere);
        });
      })
      .catch(err => reject(SystemError.BusinessException(err)));
  });

ManagerService.sendNotification = req =>
  new Promise((resolve, reject) => {
    if (req.body.title == '' || req.body.content == '') return reject(ManagerError.FieldEmpty());
    const newReq = {
      className: req.body.className,
      title: req.body.title,
      content: req.body.content,
      sendDate: moment().toDate()
    };
    Class.findOneAndUpdate(
      { $and: [{ _id: req.body.id }, { managerId: req.tokenData.userId }] },
      { $push: { notification: newReq } },
      { new: true }
    )
      .then(() => {
        Class.findOne({ _id: req.body.id }).then(instance => {
          instance.students.map(student =>
            User.findOneAndUpdate(
              { _id: student.userId },
              { $push: { notification: newReq } },
              { new: true }
            )
              .then(() => {
                resolve(newReq);
              })
              .catch(err => {
                reject(err);
              })
          );
        });
      })
      .catch(err => {
        reject(err);
      });
  });

ManagerService.makeReport = req =>
  new Promise((resolve, reject) => {
    let result = [];
    Class.findOne({ _id: req.params.id }, 'qheres')
      .then(instance => {
        instance.qheres.map(qhere => result.push({ studentCount: qhere.students.length }));
        return resolve(result);
      })
      .catch(err => reject(err));
  });

module.exports = ManagerService;
