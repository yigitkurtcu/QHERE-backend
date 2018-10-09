const UserError = require('../errors/UserError');

const User=require('../models/Users')

const UserService = {};

UserService.login = (req) => {
    return new Promise((resolve,reject) => {
        const user=req.body;
        User.findOne(user).then((userInstance) => {
            if(!userInstance) {
                return reject(UserError.UserNotFound()); 
            }
            return resolve(userInstance);
        }).catch((err)=>{
            return reject(UserError.BusinessException()); 
        })  
    });
}

UserService.register = (req) => {

    return new Promise((resolve,reject) => {
        if(User.findOne({email: req.body.email}).then((userInstance) => {
            if(userInstance) 
                return reject(UserError.EmailExist()); 

            const {userName,fullName,email,password,gender}=req.body;
            var user = User({
                userName,
                fullName,
                email,
                password,
                gender
            });
            user.save()
            .then(userInstance => {
                console.log(userInstance);
                return resolve(userInstance);
            })
            .catch(err => {
                return reject(UserError.BusinessException(err)); 
            })
        }));
    });
}

module.exports = UserService;