const ManagerError = {};

ManagerError.NotAcceptable = () => {
    return {
        status: 406, 
        name : 'Not Acceptable',
        message: 'Bu Derse Kayıtlısınız'
    }
};

ManagerError.BadRequest = () => {
    return {
        status: 400, 
        name : 'Bad Request',
        message: 'Bu Ders Kotası Dolu'
    }
};

ManagerError.BusinessException = () => {
    return {
        status: 400, 
        name : 'BussinesException',
        message: 'BusinessException'
    }
};

module.exports = ManagerError;