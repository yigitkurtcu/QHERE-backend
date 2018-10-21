const AuthError = {};

AuthError.WrongToken = () => {
    return {
        status_code: 400, 
        name : 'Wrong Token',
        message: 'Token dogrulanamadı.'
    }
};

AuthError.NotAllowed = () => {
    return {
        status_code: 400, 
        name : 'Not Allowed',
        message: 'You must be manager.'
    }
};


module.exports = AuthError;