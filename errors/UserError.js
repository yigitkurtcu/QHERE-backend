const UserError = {};

UserError.BusinessException = () => {
    return {
        status: 400, 
        name : 'BussinesException',
        message: 'BusinessException'
    }
};

UserError.UserNotFound = () => {
    return {
        status: 404, 
        name : 'UserNotFound',
        message: 'User can not found.'
    }
};

UserError.WrongPassword = () => {
    return {
        status: 400, 
        name : 'WrongPassword',
        message: 'User password wrong.'
    }
};

UserError.EmailExist = () => {
    return {
        status: 404, 
        name : 'EmailExist',
        message: 'Email is already registered.'
    }
};

module.exports = UserError;