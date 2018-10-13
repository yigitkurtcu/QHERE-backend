const Class =require('../models/Class')
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

            Class.find({_id:req.params.id}).then((collection=>{

                if(collection!==null){
                    collection[0].students.forEach(Students => {
                        if(Students.StudentId==userId)
                            return reject (ManagerError.NotAcceptable());
                    });
                }

                Class.findOneAndUpdate({ _id: req.params.id}, { $push: {students:{$each: [{StudentId:userId}], $slice: collection[0].quota}}},{new: true}).then((updateClass)=>{
                        return resolve(updateClass);
                }).catch((Err)=>{
                        return reject(ManagerError.BusinessException())
                })
            }))
        })
    })
}

module.exports=ManagerService;