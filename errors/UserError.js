const UserError = {};

UserError.BusinessException = () => {
    return {
        status: 400, 
        name : 'BussinesException',
        message: 'BusinessException'
    }
};

module.exports = UserError;