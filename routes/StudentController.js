const express = require('express');
const router = express.Router();
const respond = require('../helpers/respond');

const StudentService = require('../services/StudentService.js');

router.get('/getClasses',function(req,res,next){
    StudentService.getClasses(req).then((result)=>{
        respond.success(res,result);
    }).catch((err)=>{
        console.log('ERROR:', err)
        respond.withError(res,err);
    });
});

module.exports = router;