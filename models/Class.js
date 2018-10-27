var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
    managerId:{
        type:String,
        required: true,
    },
    managerName:{
        type:String,
        required: true,
    },
    className:{
        type:String,
        required: true,
    },
    joinTime:{
        type:Date,
        required: true,
    },
    quota:{
        type:Number,
        required:true
    },
    discontinuity:{
        type:Number,
        required:true
    },
    description:{
        type:String,
    },
    students:[]
});
module.exports = mongoose.model('Class', classSchema);