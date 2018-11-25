const SystemError = {};

SystemError.BusinessException = (err) => {
    return {
        status_code: 400, 
        name : 'BussinesException',
        message: err || 'BusinessException'
    }
};

SystemError.WrongEndPoint = () => {
    return {
        status_code: 400, 
        name : 'WrongEndPoint',
        message: 'This endpoint is wrong!'
    }
};

module.exports = SystemError;