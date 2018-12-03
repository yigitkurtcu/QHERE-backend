const AuthError = {};

AuthError.WrongToken = () => {
    return {
        status_code: 400, 
        name : 'Wrong Token',
        message: 'Token is not be verified.'
    }
};

AuthError.NotAllowed = () => {
    return {
        status_code: 400, 
        name : 'Not Allowed',
        message: 'You must be manager.'
    }
};

AuthError.UnauthorizedError = msg => {
    return {
        status_code: 401, 
        name : 'UnauthorizedError',
        message: 'Unauthorized.'
    }
};

module.exports = AuthError;