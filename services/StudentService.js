const _ = require('lodash');
const Class = require('../models/Class');
const SystemError = require('../errors/SystemError');

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

module.exports = studentService;