const StudentError = {};

StudentError.StudentAlreadyRequested = () => {
    return {
        status_code: 409, 
        name : 'StudentAlreadyRequested',
        message: 'The student has already requested a join.'
    }
};

StudentError.StudentAlreadyJoin = () => {
    return {
        status_code: 409, 
        name : 'StudentAlreadyJoin',
        message: 'The student has already joined class.'
    }
};

module.exports = StudentError;