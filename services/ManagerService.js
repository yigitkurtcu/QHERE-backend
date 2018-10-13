const Class =require('../models/Class')
const TokenService = require('./TokenService');
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

module.exports=ManagerService;