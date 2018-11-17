const StudentError = {};

StudentError.StudentAlreadyRequested = () => {
    return {
        status_code: 400, 
        name : 'StudentAlreadyRequested',
        message: 'The student has already requested a join.'
    }
};

StudentError.StudentAlreadyJoin = () => {
    return {
        status_code: 400, 
        name : 'StudentAlreadyJoin',
        message: 'The student has already joined class.'
    }
};

StudentError.ClassFull = () => {
    return {
        status_code: 400, 
        name : 'ClassisFull',
        message: 'The class student requested to join is full.'
    }
};

StudentError.Rejected = () => {
    return {
        status_code: 400, 
        name : 'Rejected',
        message: 'The student request is already rejected.'
    }
};

module.exports = StudentError;