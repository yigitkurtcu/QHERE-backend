const jwt = require('jsonwebtoken');
const config=require('../config');
const Token=require('../models/Token')
const AuthError = require('../errors/AuthError');
tokenService={}

tokenService.generateToken = function (instance) {
    return new Promise(function (resolve, reject) {
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
};

tokenService.verifyToken=function(instance){
    return new Promise(function(resolve,reject){
        Token.find({'token.accessToken':instance})
        .then((token)=>{
            return resolve(token[0].userId);
        }).catch(err => {
            return reject(AuthError.WrongToken());
        })
    });
};

tokenService.removeToken = function (token) {
    return new Promise((resolve, reject) => {
        Token.findOneAndDelete({ "token.accessToken": token }).then(() => {
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