const UserError = {};

UserError.BusinessException = () => {
    return {
        status_code: 400, 
        name : 'BussinesException',
        message: 'BusinessException'
    }
};

UserError.UserNotFound = () => {
    return {
        status_code: 404, 
        name : 'UserNotFound',
        message: 'User can not found.'
    }
};

UserError.UserNotActive = () => {
    return {
        status_code: 404, 
        name : 'UserNotActive',
        message: 'User not active.'
    }
};

UserError.UserSchoolNumber = () => {
    return {
        status_code: 404, 
        name : 'UserSchoolNumber',
        message: 'Scholl number empty'
    }
};

UserError.CodeNotValid = () => {
    return {
        status_code: 406, 
        name : 'CodeNotValid',
        message: 'Code is not valid.'
    }
};

UserError.WrongPassword = () => {
    return {
        status_code: 400, 
        name : 'WrongPassword',
        message: 'User password wrong.'
    }
};

UserError.UserExist = () => {
    return {
        status_code: 404, 
        name : 'EmailorSchoolNumberExist',
        message: 'Email or school number is already registered.'
    }
};

module.exports = UserError;