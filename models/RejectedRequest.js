var mongoose = require('mongoose');

var rejectedRequestSchema = mongoose.Schema({
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
    }
})

module.exports = mongoose.model('rejectedRequest', rejectedRequestSchema)