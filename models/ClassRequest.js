var mongoose = require('mongoose');

var classRequestSchema = mongoose.Schema({
    managerId: {
        type: String,
        required: true
    },
    managerName: {
        type: String,
        required: true
    },
    classId: {
        type: String,
        required: true,
    },
    className: {
        type: String,
        required: true,
    },
    studentId: {
        type: String,
        required: true,
    },
    studentName: {
        type: String,
        required: true
    },
    studentNumber: {
        type: Number,
        required: true
    },
    requestDate: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model('classRequest', classRequestSchema)