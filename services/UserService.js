const bcrypt =require('bcryptjs');
const UserError = require('../errors/UserError');
const TokenService = require('./TokenService');
const MailService=require('./MailService');
const User=require('../models/Users')
const Token=require('../models/Token')
const AuthError = require('../errors/AuthError');
const UserService = {};

UserService.login = (req) => {
    return new Promise((resolve,reject) => {
        User.findOne({email:req.body.email}).then((userInstance) => {
            if(!userInstance) {
                return reject(UserError.UserNotFound()); 
            }else{
                bcrypt.compare(req.body.password,userInstance.password, function(err, res) {
                    if(res==true){
                        TokenService.generateToken(userInstance).then(function (token) {
                            userInstance = userInstance.toObject();
                            let response = {
                                userType: userInstance.userType,
                                token: token
                            };
                            console.log(userInstance);
                            let TokenSave=Token({
                                userId:userInstance._id,
                                userType: userInstance.userType,
                                schoolNumber: userInstance.schoolNumber,
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

            //if(schoolNumber exist reject)
            
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
                        return resolve(userInstance);
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
        TokenService.verifyToken(req.headers.authorization).then((data)=> {
            TokenService.removeToken(req.headers.authorization).then((userInstance) => {
                return resolve(userInstance);
            }).catch((err) => {
                return reject(AuthError.WrongToken());
            });
        }).catch((err)=>{
            return reject(AuthError.WrongToken());
        })  
        
    })
}

UserService.forgot=(req)=>{
    return new Promise((resolve,reject)=>{
        User.findOne({email:req.body.email}).then((userInstance)=>{
            let user={
                _id:userInstance._id,
                email:userInstance.email
            }
            if(user !== null){
                MailService.getMail(user).then((res)=>{
                    return resolve(res)
                }).catch((err)=>{
                    return reject(err)
                })
            }else{
                return reject (UserError.BusinessException())
            }         
        }).catch((err)=>{
            return reject(err)
        })

    })
}

UserService.resetPassword=(req)=>{
    return new Promise((resolve,reject)=>{
        User.find({_id:req.body._id}).then((userInstance)=>{
            if(userInstance){
                bcrypt.hash(req.body.newPassword,10).then(hashPassword=>{
                    let newPassword=hashPassword
                    User.findOneAndUpdate({_id:req.body._id},{$set:{password:newPassword}},{new: true}).then((userInstance)=>{
                        return resolve (userInstance)
                    }).catch((err)=>{
                        return reject (UserError.BusinessException())
                    })

                }).catch((err)=>{
                    return reject(err);
                })
            }
            
        }).catch((err)=>{
            console.log(err);
        })
    })
}

module.exports = UserService;