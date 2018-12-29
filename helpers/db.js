const mongoose = require('mongoose');
const config = require('../config');

module.exports = () => {
  mongoose.connect(
    config.dbUrl,
    { useNewUrlParser: true }
  );
  mongoose.connection.on('open', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', err => {
    console.log('MongoDB Error:', err);
  });
};
