const Class =require('../models/Class')
const User =require('../models/Users')
const TokenService = require('./TokenService');
const ManagerError=require('../errors/ManagerError');
ManagerService={};

ManagerService.createClass=(req)=>{
    return new Promise ((resolve,reject)=>{
        TokenService.verifyToken(req.headers.authorization).then((userId)=>{

            const {className,joinTime,quota,discontinuity,description}=req.body;

            let createClass=Class({
                managerId:userId,
                className,
                joinTime,
                quota,
                discontinuity,
                description
            })
            createClass.save();
            return resolve(createClass);
        }).catch((err)=>{
            return reject(err);
        })
    })
    
}

ManagerService.ApproveStudents=(req)=>{

    return new Promise ((resolve,reject)=>{
        TokenService.verifyToken(req.headers.authorization).then((userId)=>{

            User.find({schoolNumber:req.body.schoolNumber}).then((instance)=>{
            const id=instance[0]._id.toString();
            Class.find({_id:req.params.id}).then((collection=>{
                const studentId=collection[0].students.find(studentId=>studentId==id)
                if(!studentId){
                    Class.findOneAndUpdate({ _id: req.params.id}, { $push:{students:{$each: [id], $slice:collection[0].quota}}},{new: true}).then((updateClass)=>{
                        if(collection[0].students.length==collection[0].quota){
                            return reject(ManagerError.BadRequest())
                        }else{
                            return resolve(updateClass);
                        }   
                    }).catch((Err)=>{
                            
                    })
                }else{
                    return reject(ManagerError.NotAcceptable());
                }
            })
                           
            )
        })
    })
})
}

module.exports=ManagerService;