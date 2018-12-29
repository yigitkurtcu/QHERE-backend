const express = require('express');
const respond = require('../helpers/respond');
const UserService = require('../services/UserService.js');

const router = express.Router();
// TO-DO: VALİDASYONLAR YAZILACAK
router.post('/login', (req, res) => {
  UserService.login(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.post('/register', (req, res) => {
  UserService.register(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.post('/logout', (req, res) => {
  UserService.logout(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.post('/forgot', (req, res) => {
  UserService.forgot(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.post('/resetPassword', (req, res) => {
  UserService.resetPassword(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

module.exports = router;
