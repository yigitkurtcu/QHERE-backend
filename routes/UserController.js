const express = require('express');
const router = express.Router();

const respond = require('../helpers/respond');

const UserService = require('../services/UserService.js');

//TO-DO: VALİDASYONLAR YAZILACAK
router.post('/login', function(req, res, next) {
  UserService.login(req).then((result) => {
    respond.success(res, result);
  }).catch((err) => {
    respond.withError(res, err);
  });
});

router.post('/register', function(req, res, next) {
  UserService.register(req).then((result) => {
    respond.success(res, result);
  }).catch((err) => {
    respond.withError(res, err);
  });
});

router.post('/logout',function(req,res,mext){
  UserService.logout(req).then((result)=>{
    respond.success(res, result);
  }).catch((err)=>{
    respond.withError(res, err);
  })
});

router.post('/forgot',function(req,res,next){
  UserService.forgot(req).then((result)=>{
    respond.success(res, result);
  }).catch((err)=>{
    respond.withError(res, err);
  })
});

router.post('/resetPassword',function(req,res){
  UserService.resetPassword(req).then((result)=>{
    respond.success(res,result);
  }).catch((err)=>{
    respond.withError(res,err);
  })
})

module.exports = router;
