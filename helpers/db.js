const mongoose =require('mongoose');

module.exports=()=>{
    mongoose.connect('mongodb://qhere:MY1234@ds125693.mlab.com:25693/qhere-database',{ useNewUrlParser: true });
    mongoose.connection.on('open',()=>{
        console.log('MongoDB connected');
    })

    mongoose.connection.on('error',(err)=>{
        console.log('MongoDB Error:',err);
    })
}