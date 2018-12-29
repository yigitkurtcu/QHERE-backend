const UserError = {};

UserError.BusinessException = () => ({
  status_code: 400,
  name: 'BussinesException',
  message: 'BusinessException'
});

UserError.UserNotFound = () => ({
  status_code: 404,
  name: 'UserNotFound',
  message: 'User can not found.'
});

UserError.UserNotActive = () => ({
  status_code: 404,
  name: 'UserNotActive',
  message: 'User not active.'
});

UserError.UserSchoolNumber = () => ({
  status_code: 404,
  name: 'UserSchoolNumber',
  message: 'Scholl number empty'
});

UserError.CodeNotValid = () => ({
  status_code: 406,
  name: 'CodeNotValid',
  message: 'Code is not valid.'
});

UserError.WrongPassword = () => ({
  status_code: 400,
  name: 'WrongPassword',
  message: 'User password wrong.'
});

UserError.UserExist = () => ({
  status_code: 404,
  name: 'EmailorSchoolNumberExist',
  message: 'Email or school number is already registered.'
});

module.exports = UserError;
