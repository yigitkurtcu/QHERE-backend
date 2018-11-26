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

StudentError.StudentAlreadyJoinRollCall = () => {
    return {
        status_code: 400, 
        name : 'StudentAlreadyJoin',
        message: 'The student has already joined roll call.'
    }
};

StudentError.ClassFull = () => {
    return {
        status_code: 400, 
        name : 'ClassisFull',
        message: 'The class student requested to join is full.'
    }
};

StudentError.Expired = () => {
    return {
        status_code: 400, 
        name : 'Expired',
        message: 'Expired'
    }
};

StudentError.Rejected = () => {
    return {
        status_code: 400, 
        name : 'Rejected',
        message: 'The student request is already rejected.'
    }
};

StudentError.notInClass = () => {
    return {
        status_code: 400, 
        name : 'notInClass',
        message: 'The student is not in the class.'
    }
};

module.exports = StudentError;