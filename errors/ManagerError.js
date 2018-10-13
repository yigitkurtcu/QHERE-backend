const ManagerError = {};

ManagerError.NotAcceptable = () => {
    return {
        status: 406, 
        name : 'Not Acceptable',
        message: 'Bu Derse Kayıtlısınız'
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