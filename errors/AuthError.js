const AuthError = {};

AuthError.WrongToken = () => ({
  status_code: 400,
  name: 'Wrong Token',
  message: 'Token is not be verified.'
});

AuthError.NotAllowed = () => ({
  status_code: 400,
  name: 'Not Allowed',
  message: 'You must be manager.'
});

AuthError.UnauthorizedError = msg => ({
  status_code: 401,
  name: 'UnauthorizedError',
  message: msg || 'Unauthorized.'
});

module.exports = AuthError;
