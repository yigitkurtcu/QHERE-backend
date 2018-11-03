const _ = require('lodash');
var moment = require('moment')
const Class = require('../models/Class');
const User =require('../models/Users')
const ClassRequest =require('../models/ClassRequest')
const SystemError = require('../errors/SystemError');
const StudentError = require('../errors/StudentError');
studentService={}

studentService.getClasses = (req) => {
    return new Promise(function (resolve, reject) {
        Class.find({}).then(classes => {
            return resolve(classes);
        }).catch(err => {
            return reject(new SystemError.BusinessException());
        })
    })
};

studentService.getUserClasses = (req) => {
    return new Promise(function (resolve, reject) {
        Class.find({'students.schoolNumber': req.tokenData.schoolNumber}).then(res => {
            var result = res.map(x => _.pick(x, ['_id', 'managerId', 'className','joinTime','quota', 'discontinuity', 'description', 'managerName']));
            return resolve(result);
        }).catch(err => {
            console.log(err)
            return reject(SystemError.BusinessException(err));
        })
    })
};

studentService.joinClass = (req) => {
    return new Promise(function (resolve, reject) {
        ClassRequest.find({classId: req.params.id, studentId: req.tokenData.userId})
        .then(res => {
            if(res.length > 0)
                return reject(StudentError.StudentAlreadyJoin());

            User.findOne({_id: req.tokenData.userId})
            .then(userInstance => {
                Class.findOne({_id: req.params.id})
                .then(classInstance => {
                    console.log(classInstance)
                    var classReq = new ClassRequest({
                        'managerId':classInstance.managerId,
                        'managerName': classInstance.managerName,
                        'classId': req.params.id,
                        'className': classInstance.className,
                        'studentId': req.tokenData.userId,
                        'studentName': userInstance.fullName,
                        'requestDate': moment().toDate()
                    });
                    classReq.save()
                    .then(instance => {
                        return resolve(instance);
                    }).catch(err => {
                        console.log(err)
                        return reject(err);
                    })
                }).catch(err => {
                    console.log(err)
                    return reject(err);
                })
            }).catch(err => {
                console.log(err)
                return reject(err);
            })
        }).catch(err => {
            return reject(err);
        })
    })
};

module.exports = studentService;