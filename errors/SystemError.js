const SystemError = {};

SystemError.BusinessException = () => {
    return {
        status_code: 400, 
        name : 'BussinesException',
        message: 'BusinessException'
    }
};

module.exports = SystemError;