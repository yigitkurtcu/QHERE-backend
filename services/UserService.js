const UserError = require('../errors/UserError');

const User=require('../models/Users')

const UserService = {};

UserService.login = (req) => {
    return new Promise((resolve,reject) => {
        const user=req.body;
        User.findOne(user).then((userInstance) => {
            return resolve(userInstance);
        }).catch((err)=>{
            return reject(UserError.BusinessException()); 
        })  
    });
}

UserService.register = (req) => {
    return new Promise((resolve,reject) => {
        const {userName,surName,email,password,gender}=req.body;

        const user=User({
            userName,
            surName,
            email,
            password,
            gender
        })
        const data=user.save();
         return resolve(data);
         return reject(UserError.BusinessException()); 
    });
}

module.exports = UserService;