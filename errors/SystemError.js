const SystemError = {};

SystemError.BusinessException = (err) => {
    return {
        status_code: 400, 
        name : 'BussinesException',
        message: err || 'BusinessException'
    }
};

module.exports = SystemError;