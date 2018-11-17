const express = require('express');
const router = express.Router();
const Token = require('../services/TokenService');
const respond = require('../helpers/respond');
const verifier = require('../helpers/verifier');

const ManagerService = require('../services/ManagerService.js');

router.post('/createClass', [verifier.verifyToken, verifier.verifyManager], function (req, res, next) {
    ManagerService.createClass(req).then((result) => {
        respond.success(res, result);
    }).catch((err) => {
        respond.withError(res, err);
    });
});

router.get('/getClasses', [verifier.verifyToken, verifier.verifyManager], function (req, res, next) {
    ManagerService.getClasses(req).then((result) => {
        respond.success(res, result);
    }).catch((err) => {
        respond.withError(res, err)
    })
})

router.get('/getClassesRequest', [verifier.verifyToken, verifier.verifyManager], function (req, res, next) {
    ManagerService.getClassesRequest(req).then((result) => {
        respond.success(res, result);
    }).catch((err) => {
        respond.withError(res, err)
    })
})


router.put('/:id/approveStudent', [verifier.verifyToken, verifier.verifyManager], function (req, res, next) {
    ManagerService.approveStudents(req).then((result) => {
        respond.success(res, result);
    }).catch((err) => {
        respond.withError(res, err);
    });
});

router.post('/:id/rejectStudent', [verifier.verifyToken, verifier.verifyManager], function (req, res, next) {
    ManagerService.rejectStudents(req).then((result) => {
        respond.success(res, result);
    }).catch((err) => {
        respond.withError(res,err);
    })
})

router.get('/class/:id/info', [verifier.verifyToken, verifier.verifyManager], function (req, res, next) {
    ManagerService.getClassInfo(req).then((result) => {
        respond.success(res, result);
    }).catch((err) => {
        respond.withError(res,err);
    })
})

router.delete('/:id/deleteClass',[verifier.verifyToken, verifier.verifyManager],function(req,res,next){
    ManagerService.deleteClass(req).then((result)=>{
        respond.success(res,result);
    }).catch((err)=>{
        respond.withError(res,err);
    })
})

router.put('/:id/updateClass',[verifier.verifyToken, verifier.verifyManager],function(req,res,next){
    ManagerService.updateClass(req).then((result)=>{
        respond.success(res,result);
    }).catch((err)=>{
        respond.withError(res,err);
    })
})

router.put('/createQr',[verifier.verifyToken,verifier.verifyManager],function(req,res,next){
    ManagerService.createQr(req).then((result)=>{
        respond.success(res,result);
    }).catch((err)=>{
        respond.withError(res,err);
    })
})
module.exports = router;