const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
  schoolNumber: {
    type: Number
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Erkek', 'Kadın', 'Diğer']
  },
  userType: {
    type: String,
    enum: ['Manager', 'Student'],
    default: 'Student'
  },
  isAccountActive: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('user', UserSchema);
