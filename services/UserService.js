const bcrypt =require('bcryptjs');
const UserError = require('../errors/UserError');
const TokenService = require('./TokenService');
const User=require('../models/Users')
const Token=require('../models/Token')

const UserService = {};

UserService.login = (req) => {
    return new Promise((resolve,reject) => {
        User.findOne({email:req.body.email}).then((userInstance) => {
            if(!userInstance) {
                return reject(UserError.UserNotFound()); 
            }else{
                bcrypt.compare(req.body.password,userInstance.password, function(err, res) {
                    if(res==true){
                        TokenService.generateToken(req.body).then(function (token) {
                            userInstance = userInstance.toObject();
                            let response = {
                                userType: userInstance.userType,
                                token: token
                            };
                            console.log(userInstance);
                            let TokenSave=Token({
                                userId:userInstance._id,
                                userType: userInstance.userType,
                                token:{
                                    accessToken:token.accessToken
                                }
                            })
                            TokenSave.save();
                            return resolve(response);
                        }).catch((err)=>{
                        return reject(UserError.BusinessException()); 
                        })
                    }else{
                        return reject(UserError.WrongPassword());
                    }
                });
            }}).catch((err)=>{
                return reject(UserError.BusinessException()); 
            })
    })
}
    

UserService.register = (req) => {

    return new Promise((resolve,reject) => {
        if(User.findOne({email: req.body.email}).then((userInstance) => {
            if(userInstance) 
                return reject(UserError.EmailExist());
            
            const {schoolNumber,fullName,email,password,gender}=req.body;
            
                bcrypt.hash(password,10).then(hash=>{
                    let user = User({
                        schoolNumber,
                        fullName,
                        email,
                        password:hash,
                        gender
                    });
                    user.save()
                    .then(userInstance => {
                        return resolve(user);
                    }).catch(err => {
                        return reject(UserError.BusinessException()); 
                    })
                }).catch((err)=>{
                    return reject(UserError.BusinessException()); 
                })
        }).catch((err)=>{
            return reject(UserError.BusinessException()); 
        }));
    });
}

UserService.logout=(req)=>{
    return new Promise((resolve,reject)=>{
        TokenService.removeToken(req.headers.authorization).then((userInstance) => {
            return resolve(userInstance);
        }).catch((err) => {
            return reject(err);
        });
    })
}

module.exports = UserService;