const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
  managerId: {
    type: String,
    required: true
  },
  managerName: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  lastJoinTime: {
    type: Date,
    required: true
  },
  quota: {
    type: Number,
    required: true
  },
  discontinuity: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  students: [
    {
      userId: String,
      fullName: String,
      email: String,
      schoolNumber: Number,
      studentDiscontinuity: {
        type: Number,
        default: 0
      }
    }
  ],
  qheres: [
    {
      number: {
        type: Number,
        required: true
      },
      isActive: {
        type: Boolean,
        default: true
      },
      students: [
        {
          userId: String,
          fullName: String,
          email: String,
          schoolNumber: Number
        }
      ]
    }
  ],
  notification: [
    {
      title: String,
      content: String,
      sendDate: Date
    }
  ]
});
module.exports = mongoose.model('Class', classSchema);
