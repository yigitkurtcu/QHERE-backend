const _ = require("lodash");
var moment = require("moment");
const Class = require("../models/Class");
const User = require("../models/Users");
const ClassesRequest = require("../models/ClassRequest");
const RejectedRequest=require("../models/RejectedRequest");
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
              return reject(SystemError.BusinessException(err));
            });
      }).catch((err)=>{
        return reject(SystemError.BusinessException(err));
      })
  });
};

ManagerService.approveStudents = (req) => {
  return new Promise((resolve, reject) => {
    ClassesRequest.findOne({$and:[{_id: req.params.id },{managerId:req.tokenData.userId}]}).then((approveStudent) => {
      if (approveStudent === null)
        return reject(ManagerError.ClassRequestNotFound());
        
      User.findOne({ _id: approveStudent.studentId }).then((instance) => {
        let newStudent = {
          "userId": instance._id,
          "fullName": instance.fullName,
          "schoolNumber": instance.schoolNumber,
          "email": instance.email
        };
        Class.findOneAndUpdate({ _id: approveStudent.classId }, {
          $push: {
            students: newStudent
          }
        }, { new: true }).then((instance) => {
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
  })
}

ManagerService.rejectStudents = (req) => {
  return new Promise((resolve, reject) => {
    ClassesRequest.findOneAndDelete({$and:[{_id: req.params.id },{managerId:req.tokenData.userId}]}).then((rejectStudent) => {
      if(rejectStudent===null)
        return reject(ManagerError.BadRequest())

      let rejectedStudent = RejectedRequest({
      classId:rejectStudent.classId,
      className:rejectStudent.className,
      studentId:rejectStudent.studentId,
      studentName: rejectStudent.studentName
      })
      rejectedStudent.save()
        .then((rejectInstance) => {
          return resolve(rejectInstance);
        })
        .catch(err => {
          return reject(SystemError.BusinessException(err));
        });
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
    Class.find({$and:[{_id: req.params.id },{managerId:req.tokenData.userId}]})
      .then(classInstance => {
        if(classInstance.length===0)
          return reject(ManagerError.BadRequest());

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
        Class.findOneAndDelete({$and:[{_id:req.params.id},{managerId:req.tokenData.userId}]}).then((classInstance)=>{
          if(classInstance===null)
            return reject(ManagerError.BadRequest())  
          
          return resolve(classInstance)
        })
        .catch((err)=>{
            return reject (ManagerError.BadRequest())
        })
    })
}

ManagerService.updateClass=(req)=>{
    return new Promise((resolve,reject)=>{
        Class.findOneAndUpdate({$and:[{_id:req.params.id},{managerId:req.tokenData.userId}]},req.body,{ new: true }).then((instance)=>{
          if(instance===null)
            return reject(ManagerError.BadRequest())

          return resolve(instance);
        })
        .catch((err)=>{
                return reject (ManagerError.BadRequest())
        })
    })
}

ManagerService.createQr=(req)=>{
  return new Promise((resolve,reject)=>{
      Class.findOne({$and:[{_id:req.body.classId},{managerId:req.tokenData.userId}]}).then((instance)=>{
        if(instance===null || instance.qheres.length===15 )
            return reject (ManagerError.BadRequest());

        Class.findOneAndUpdate({_id:req.body.classId},{$push:{qheres:{"number":instance.qheres.length+1}}},{new:true}).then((updateInstance)=>{     
          return resolve(updateInstance)

        }).catch((err)=>{
          return reject(SystemError.BusinessException(err))
        })
      }).catch((err)=>{
          return reject(SystemError.BusinessException(err));
      })
  })
}

ManagerService.getQrInfo=(req)=>{
  return new Promise((resolve,reject)=>{
    
    Class.findOne({$and:[{"qheres._id":{_id:req.params.id}},{managerId:req.tokenData.userId}]}).then((qrInstance)=>{
      if(qrInstance===null)
        return reject (ManagerError.BadRequest());
      qrInstance.qheres.find(qhere=>{
        if(JSON.stringify(qhere._id)===JSON.stringify(req.params.id))
          return resolve(qhere);
      })
    }).catch((err)=>{
      return reject (SystemError.BusinessException(err))
    })
  })
}

ManagerService.sendNotification=(req)=>{
  return new Promise((resolve,reject)=>{
    const newReq ={
      title:req.body.title,
      content:req.body.content,
      sendDate:moment().toDate()
    }
    Class.findOneAndUpdate({$and:[{_id:req.body.id},{managerId:req.tokenData.userId}]},{ $push:{notification:newReq}},{new:true}).then((instance)=>{
      return resolve (instance);
    }).catch((err)=>{
      return reject(err);
    })
  })
}

module.exports = ManagerService;