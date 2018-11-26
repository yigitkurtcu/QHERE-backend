var mongoose = require('mongoose');

var tokenSchema = mongoose.Schema({
    userId:{
        type:String,
        required: true,
    },
    userType: {
        type: String,
        enum: ["Manager","Student"],
        required: true
    },
    schoolNumber: {
        type: Number,
    },
    token :{
        accessToken:{
            type : String,
            required : true,
        }
    }
});
module.exports = mongoose.model('tokens', tokenSchema);