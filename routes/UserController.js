const express = require('express');
const router = express.Router();

const respond = require('../helpers/respond');

const UserService = require('../services/UserService.js');


router.get('/login', function(req, res, next) {
  UserService.login(req).then((result) => {
    respond.success(res, result);
  }).catch((err) => {
    respond.withError(res, err);
  });
});


module.exports = router;
