const mongoose = require('mongoose');

const ForgotCodeSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ForgotCode', ForgotCodeSchema);
