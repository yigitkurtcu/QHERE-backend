const StudentError = {};

StudentError.StudentAlreadyJoin = () => {
    return {
        status_code: 409, 
        name : 'StudentAlreadyJoin',
        message: 'The student has already requested a join.'
    }
};

module.exports = StudentError;