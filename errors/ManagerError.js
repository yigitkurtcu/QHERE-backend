const ManagerError = {};

ManagerError.NotAcceptable = () => ({
  status_code: 406,
  name: 'Not Acceptable',
  message: 'Bu Derse Kayıtlı'
});

ManagerError.BadRequest = () => ({
  status_code: 400,
  name: 'Bad Request',
  message: 'Yanlış bir istek yaptınız.'
});

ManagerError.FieldEmpty = () => ({
  status_code: 400,
  name: 'Field Empty',
  message: 'Fields is empty'
});

ManagerError.ClassRequestNotFound = () => ({
  status_code: 404,
  name: 'ClassRequestNotFound',
  message: 'Class request not found.'
});

ManagerError.BusinessException = () => ({
  status_code: 400,
  name: 'BussinesException',
  message: 'BusinessException'
});

module.exports = ManagerError;
