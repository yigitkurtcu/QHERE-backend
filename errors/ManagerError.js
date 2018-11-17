const ManagerError = {};

ManagerError.NotAcceptable = () => {
    return {
        status_code: 406, 
        name : 'Not Acceptable',
        message: 'Bu Derse Kayıtlı'
    }
};

ManagerError.BadRequest = () => {
    return {
        status_code: 400, 
        name : 'Bad Request',
        message: 'Bu Dersin Kotası Dolu'
    }
};

ManagerError.ClassRequestNotFound = () => {
    return {
        status_code: 404, 
        name : 'ClassRequestNotFound',
        message: 'Class request not found.'
    }
};

ManagerError.BusinessException = () => {
    return {
        status_code: 400, 
        name : 'BussinesException',
        message: 'BusinessException'
    }
};

module.exports = ManagerError;