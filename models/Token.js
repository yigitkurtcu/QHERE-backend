var mongoose = require('mongoose');

var tokenSchema = mongoose.Schema({
    userId:{
        type:String,
        required: true,
    },
    token :{
        accessToken:{
            type : String,
            required : true,
        }
    }
});
module.exports = mongoose.model('tokens', tokenSchema);