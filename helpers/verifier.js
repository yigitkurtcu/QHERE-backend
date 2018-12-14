const respond = require('./respond');
const AuthErrors = require('../errors/AuthError');
const TokenService = require('../services/TokenService');

module.exports.verifyToken = function(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return respond.withError(res, AuthErrors.UnauthorizedError());

  TokenService.verifyToken(token)
    .then(result => {
      req.tokenData = result;
      console.log('Token has been approved', req.tokenData);
      return next();
    })
    .catch(error => respond.withError(res, error));
};

module.exports.verifyManager = function(req, res, next) {
  const token = req.headers.authorization;
  TokenService.verifyManager(token)
    .then(() => {
      console.log('Manager authorization is approved.', req.tokenData);
      return next();
    })
    .catch(error => respond.withError(res, error));
};
