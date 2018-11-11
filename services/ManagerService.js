const _ = require("lodash");
const Class = require("../models/Class");
const User = require("../models/Users");
const ClassesRequest = require("../models/ClassRequest");
const ManagerError = require("../errors/ManagerError");
const SystemError = require("../errors/SystemError");
ManagerService = {};

ManagerService.createClass = req => {
  return new Promise((resolve, reject) => {
    User.find({ _id: req.tokenData.userId }) // findOne ile query atılırsa [0] a gerek kalmaz.
      .then(userInstance => {
        const {
          className,
          lastJoinTime,
          quota,
          discontinuity,
          description
        } = req.body;
        let createClass = Class({
          managerId: req.tokenData.userId,
          className,
          lastJoinTime,
          quota,
          discontinuity,
          description,
          managerName: userInstance[0].fullName
        });
        createClass.save()
        .then(classInstance => {
          return resolve(classInstance);
        })
        .catch(err => {
          return reject(ManagerError.BusinessException());
        });
      })
      .catch(err => {
        return reject(ManagerError.BusinessException());
      });
  });
};

ManagerService.ApproveStudents = (req) => {
  return new Promise((resolve, reject) => {
    User.find({ _id: req.params.id }).then((instance) => {
      ClassesRequest.find({ studentId: req.params.id }).then((approveStudent) => {
        if (approveStudent.length == 0)
          return reject("ClassRequestte istek yok");

        Class.find({ _id: approveStudent[0].classId }).then((classInstance) => {
          const studentId = classInstance[0].students.find(studentId => studentId.studentId == req.params.id.toString())
          if (!studentId) {
            Class.findOneAndUpdate({ _id: approveStudent[0].classId }, {
              $push: {
                students: {
                  $each: [{
                    "studentId": instance[0]._id,
                    "studentName": instance[0].fullName,
                    "schoolNumber": instance[0].schoolNumber,
                    "email": instance[0].email
                  }],
                  $slice: classInstance[0].quota
                }
              }
            }, { new: true }).then((instance) => {
              if (classInstance[0].students.length == classInstance[0].quota)
                return reject(ManagerError.BadRequest())

              ClassesRequest.findOneAndDelete({ studentId: req.params.id }).then(() => {
                return resolve(instance);
              }).catch((err) => {
                return reject(ManagerError.BusinessException())
              })

            }).catch((err) => {
              return reject(err)
            })
          } else {
            ClassesRequest.findOneAndDelete({ studentId: req.params.id }).then(() => {
              return reject(ManagerError.NotAcceptable());
            })
          }
        }).catch((err) => {
          return reject(ManagerError.BusinessException())
        })
      }).catch((err) => {
        return reject(ManagerError.BusinessException())
      })
    }).catch((err) => {
      return reject(ManagerError.BusinessException())
    })
  })
}

ManagerService.RejectStudents = (req) => {
  return new Promise((resolve, reject) => {
    ClassesRequest.findOneAndDelete({ studentId: req.params.id }).then((rejectStudent) => {
      return resolve(rejectStudent)
    }).catch(err => {
      return reject(SystemError.BusinessException(err));
    });
  });
};

ManagerService.RejectStudents = req => {
  return new Promise((resolve, reject) => {
    Class.find({ _id: req.params.id }).then(classInstance => {
      let instance =
        classInstance[0].className + " sınıfına yaptığınız istek reddedildi."; //!!Hocanın servisi öğrenci bu mesajı göremez.
      return resolve(instance);
    });
  });
};

ManagerService.getClasses = req => {
  return new Promise((resolve, reject) => {
    Class.find({ managerId: req.tokenData.userId })
      .then(classes => {
        return resolve(classes);
      })
      .catch(err => {
        return reject(ManagerError.BadRequest());
      });
  });
};

ManagerService.getClassInfo = req => {
  return new Promise((resolve, reject) => {
    Class.find({ _id: req.params.id })
      .then(classInstance => {
        return resolve(classInstance);
      })
      .catch(err => {
        return reject(ManagerError.BadRequest());
      });
  });
};

ManagerService.getClassesRequest = req => {
  return new Promise((resolve, reject) => {
    ClassesRequest.find({ managerId: req.tokenData.userId })
      .then(students => {
        return resolve(students);
      })
      .catch(err => {
        return reject(err)
      })

  });
};

module.exports = ManagerService;