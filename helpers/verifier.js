var respond = require('./respond');
var AuthErrors = require('../errors/AuthError');
var TokenService = require('../services/TokenService');

module.exports.verifyToken = function (req, res, next) {
    var token = req.headers.authorization;
    if (!token) {
        return respond.withError(res, AuthErrors.UnauthorizedError());
    }
    TokenService.verifyToken(token).then((result) => {
        req.tokenData = result;
        console.log('Token has been approved', req.tokenData);
        return next();
    }).catch((error) => {
        console.log(error)
        return respond.withError(res, error);
    });
};

module.exports.verifyManager = function (req, res, next) {
    var token = req.headers.authorization;
    TokenService.verifyManager(token).then((result) => {
        console.log('Manager authorization is approved.', req.tokenData);
        return next();
    }).catch((error) => {
        console.log(error)
        return respond.withError(res, error);
    });
};