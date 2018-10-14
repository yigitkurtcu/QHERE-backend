const express = require('express');
const router = express.Router();
const Token=require('../services/TokenService');
const respond = require('../helpers/respond');

const ManagerService = require('../services/ManagerService.js');

router.post('/createClass',function(req,res,next){
    ManagerService.createClass(req).then((result)=>{
        respond.success(res,result);
    }).catch((err)=>{
        respond.withError(res,err);
    });
});


router.put('/:id/approveStudent',function(req,res,next){
    ManagerService.ApproveStudents(req).then((result)=>{
        respond.success(res,result);
    }).catch((err)=>{
        respond.withError(res,err);
    });
});

router.get('/:id/rejectStudent',function(req,res,next){
    ManagerService.RejectStudents(req).then((result)=>{
        respond.success(res,result);
    }).catch((err)=>{
        respond.withError(res.err);
    })
})
module.exports = router;