const ManagerError = {};

ManagerError.NotAcceptable = () => {
    return {
        status_code: 406, 
        name : 'Not Acceptable',
        message: 'Bu Derse Kayıtlısınız'
    }
};

ManagerError.BadRequest = () => {
    return {
        status_code: 400, 
        name : 'Bad Request',
        message: 'Bu Dersin Kotası Dolu'
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