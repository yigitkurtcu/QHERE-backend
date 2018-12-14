const SystemError = {};

SystemError.BusinessException = err => ({
  status_code: 400,
  name: 'BussinesException',
  message: err || 'BusinessException'
});

SystemError.WrongEndPoint = () => ({
  status_code: 400,
  name: 'WrongEndPoint',
  message: 'This endpoint is wrong!'
});

module.exports = SystemError;
