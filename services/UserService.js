const bcrypt =require('bcryptjs');
const randomstring = require('randomstring');

const UserError = require('../errors/UserError');
const TokenService = require('./TokenService');
const MailService=require('./MailService');
const User=require('../models/Users')
const Token=require('../models/Token')
const ForgotCode=require('../models/ForgotCode')
const AuthError = require('../errors/AuthError');
const SystemError = require('../errors/SystemError');
const ObjectId = require('mongoose').Types.ObjectId; 

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
                        return reject(SystemError.BusinessException(err)); 
                        })
                    }else{
                        return reject(SystemError.WrongPassword(err));
                    }
                });
        }}).catch((err)=>{
            return reject(SystemError.BusinessException(err)); 
        })
    })
}
    

UserService.register = (req) => {

    return new Promise((resolve,reject) => {
        
        if(User.findOne({$or:[ {email:req.body.email}, {schoolNumber: req.body.schoolNumber} ]}).then((userInstance) => {
            if(userInstance) 
                return reject(UserError.UserExist());
            
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

UserService.forgot=(req)=>{//Kodu dbde olan kullanıcıya aynı kod tekrar gönderilsin db dolmasın TO-DO
    return new Promise((resolve,reject)=>{
        User.findOne({email:req.body.email}).then((userInstance)=>{
            if(!userInstance)
                return reject (UserError.UserNotFound())
            let user={
                _id:userInstance._id,
                email:userInstance.email
            }
            var code = randomstring.generate(7)
            var forgot = new ForgotCode({
                email: req.body.email,
                code
            })
            forgot.save().then(() => {
                MailService.getMail(user, code).then((res)=>{
                    return resolve(res)
                }).catch((err)=>{
                    return reject(err)
                })
            }).catch(err => {
                return reject(err)
            })
        }).catch((err)=>{
            return reject(err)
        })

    })
}

UserService.resetPassword=(req)=>{
    return new Promise((resolve,reject)=>{
        ForgotCode.findOne({code: req.body.code}).then(codeInstance => {
            if(!codeInstance)
                return reject (UserError.CodeNotValid())
            User.findOne({email: codeInstance.email}).then((userInstance)=>{
                bcrypt.hash(req.body.newPassword,10).then(hashPassword=>{
                    let newPassword=hashPassword
                    User.findOneAndUpdate({_id: new ObjectId(userInstance._id)},{$set:{password:newPassword}},{new: true}).then((newUser)=>{
                        ForgotCode.deleteOne({ code: req.body.code }).then(() => {
                            return resolve(newUser)
                        }).catch((err)=>{
                            return reject (UserError.BusinessException(err))
                        })
                    }).catch((err)=>{
                        return reject (UserError.BusinessException(err))
                    })
                }).catch((err)=>{
                    return reject(err);
                })
            }).catch((err)=>{
            })
        }).catch(err => {
            return reject(err);
        })
    })
}

module.exports = UserService;