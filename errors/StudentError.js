const StudentError = {};

StudentError.StudentAlreadyRequested = () => ({
  status_code: 400,
  name: 'StudentAlreadyRequested',
  message: 'The student has already requested a join.'
});

StudentError.StudentAlreadyJoin = () => ({
  status_code: 400,
  name: 'StudentAlreadyJoin',
  message: 'The student has already joined class.'
});

StudentError.StudentAlreadyJoinRollCall = () => ({
  status_code: 400,
  name: 'StudentAlreadyJoin',
  message: 'The student has already joined roll call.'
});

StudentError.ClassFull = () => ({
  status_code: 400,
  name: 'ClassisFull',
  message: 'The class student requested to join is full.'
});

StudentError.Expired = () => ({
  status_code: 400,
  name: 'Expired',
  message: 'Expired'
});

StudentError.Rejected = () => ({
  status_code: 400,
  name: 'Rejected',
  message: 'The student request is already rejected.'
});

StudentError.notInClass = () => ({
  status_code: 400,
  name: 'notInClass',
  message: 'The student is not in the class.'
});

module.exports = StudentError;
