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

module.exports = studentService;