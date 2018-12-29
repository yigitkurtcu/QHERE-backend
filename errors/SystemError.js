const SystemError = {};

SystemError.BusinessException = (err) => {
    return {
        status_code: 500, 
        name : 'BussinesException',
        message: err || 'BusinessException'
    }
};

SystemError.WrongEndPoint = () => {
    return {
        status_code: 404, 
        name : 'WrongEndPoint',
        message: 'This endpoint is wrong!'
    }
};

module.exports = SystemError;