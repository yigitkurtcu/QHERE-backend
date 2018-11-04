var mongoose = require('mongoose');

var ForgotCodeSchema = mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
    code: {
        type:String,
        required: true,
    }
});

module.exports = mongoose.model('ForgotCode', ForgotCodeSchema);