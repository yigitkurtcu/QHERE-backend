const _ = require("lodash");
const Class = require("../models/Class");
const User = require("../models/Users");
const ClassesRequest = require("../models/ClassRequest");
const ManagerError = require("../errors/ManagerError");
const SystemError = require("../errors/SystemError");
ManagerService = {};

ManagerService.createClass = req => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: req.tokenData.userId })
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
          managerName: userInstance.fullName
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

ManagerService.approveStudents = (req) => {
  return new Promise((resolve, reject) => {
    console.log('a',req.params)
    ClassesRequest.findOne({ _id: req.params.id }).then((approveStudent) => {
      if (approveStudent === null)
        return reject("ClassRequestte istek yok");
        
      User.findOne({ _id: approveStudent.studentId }).then((instance) => {
        Class.findOne({ _id: approveStudent.classId }).then((classInstance) => {
          const studentId = classInstance.students.find(student => student.userId === approveStudent.studentId)
          if (studentId) {
            ClassesRequest.findOneAndDelete({ _id: req.params.id }).then(() => {
              return reject(ManagerError.NotAcceptable());
            })  
          }
            Class.findOneAndUpdate({ _id: approveStudent.classId }, {
              $push: {
                students: {
                  $each: [{
                    "userId": instance._id,
                    "fullName": instance.fullName,
                    "schoolNumber": instance.schoolNumber,
                    "email": instance.email
                  }],
                  $slice: classInstance.quota
                }
              }
            }, { new: true }).then((instance) => {
              if (classInstance.students.length == classInstance.quota)
                return reject(ManagerError.BadRequest())

              ClassesRequest.findOneAndDelete({ _id: req.params.id }).then(() => {
                return resolve(instance);
              }).catch((err) => {
                return reject(ManagerError.BusinessException())
              })
            }).catch((err) => {
              return reject(err)
            })
        }).catch((err) => {
          return reject(ManagerError.BusinessException(err))
        })
      }).catch((err) => {
        return reject(ManagerError.BusinessException(err))
      })
    }).catch((err) => {
      return reject(ManagerError.BusinessException(err))
    })
  })
}

ManagerService.rejectStudents = (req) => {
  return new Promise((resolve, reject) => {
    ClassesRequest.findOneAndDelete({ studentId: req.params.id }).then((rejectStudent) => {
      return resolve(rejectStudent)
    }).catch(err => {
      return reject(SystemError.BusinessException(err));
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

ManagerService.deleteClass=(req)=>{
    return new Promise((resolve,reject)=>{
        Class.findOneAndDelete({_id:req.params.id}).then((classInstance)=>{
                    return resolve(classInstance)
        })
        .catch((err)=>{
            return reject (ManagerError.BadRequest())
        })
    })
}

ManagerService.editClass=(req)=>{
    return new Promise((resolve,reject)=>{
        Class.findOneAndUpdate({_id:req.params.id},req.body,{ new: true }).then((instance)=>{
                    console.log(instance)
                    return resolve(instance);
        })
        .catch((err)=>{
                return reject (ManagerError.BadRequest())
        })
    })
}

module.exports = ManagerService;