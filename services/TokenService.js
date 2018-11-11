const jwt = require('jsonwebtoken');
const config=require('../config');
const Token=require('../models/Token')
const AuthError = require('../errors/AuthError');
const SystemError = require('../errors/SystemError');
const ObjectId = require('mongoose').Types.ObjectId; 

tokenService={}

tokenService.generateToken = function (instance) {
    return new Promise(function (resolve, reject) {
        Token.deleteMany({ userId: new ObjectId(instance._id) }).then(() => {
            let expiresInSeconds = 5 * 60;
            let payload={
                email:instance.email
            }
            let accessToken = jwt.sign(payload,config.api_secret_key,{ expiresIn: expiresInSeconds });
            instance.token = {
                accessToken: accessToken
            };
                return resolve(instance.token);
            }).catch(function (err) {
                return reject(AuthError.TokenGenerateException);
            });
        }).catch(err => {
            return reject(SystemError.BusinessException())
        })
};

tokenService.verifyToken=function(instance){
    return new Promise(function(resolve,reject){
        Token.find({'token.accessToken':instance})
        .then((token)=>{
            if(token.length < 1)
                return reject(AuthError.WrongToken());
            var tokenData = {
                userId: token[0].userId || null,
                schoolNumber: token[0].schoolNumber
            }
            return resolve(tokenData);
        }).catch(err => {
            return reject(AuthError.WrongToken());
        })
    });
};

tokenService.removeToken = function (token) {
    return new Promise((resolve, reject) => {
        Token.findOneAndDelete({ "token.accessToken": token }).then((data) => {
            if(data===null)
                return resolve("Böyle bir token yok")
            else
                return resolve("Başarılı bir şekilde token silindi")
        }).catch((err) => {
            return reject(new AuthErrors.TokenGenerateException(err))
        });
    });
}

tokenService.verifyManager=function(instance){
    return new Promise(function(resolve,reject){
        Token.findOne({'token.accessToken':instance})
        .then((token)=>{
            if(token.userType != 'Manager')
                return reject(AuthError.NotAllowed());
            return resolve(token.userId);
        }).catch(err => {
            return reject(AuthError.WrongToken());
        })
    });
};

module.exports = tokenService;