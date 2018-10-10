const jwt = require('jsonwebtoken');
const config=require('../config');
const Token=require('../models/Token')

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
            return reject(new AuthErrors.TokenGenerateException);
        });
};

tokenService.removeToken = function (token) {
    console.log("met   "+token)
    return new Promise((resolve, reject) => {
        Token.findOneAndDelete({ "token.accessToken": token }).then(() => {
            return resolve("Başarılı bir şekilde token silindi")
        }).catch((err) => {
            return reject(new AuthErrors.TokenGenerateException(err))
        });
    });
}

module.exports = tokenService;