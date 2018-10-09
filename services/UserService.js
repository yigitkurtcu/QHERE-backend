const UserError = require('../errors/UserError');

const UserService = {};

UserService.login = (req) => {
    return new Promise((resolve,reject) => {
         return resolve({name:'yigit', 'surname':'kurtcu'});
         return reject(UserError.BusinessException()); 
    });
}

module.exports = UserService;