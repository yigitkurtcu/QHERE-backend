const express = require('express');

const router = express.Router();
const respond = require('../helpers/respond');
const verifier = require('./../helpers/verifier');

const StudentService = require('../services/StudentService.js');

router.get('/getClasses', verifier.verifyToken, (req, res) => {
  StudentService.getClasses(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.get('/getRequestClasses', verifier.verifyToken, function(req, res) {
  StudentService.getRequestClasses(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.get('/getUserClasses', verifier.verifyToken, function(req, res) {
  StudentService.getUserClasses(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.post('/:id/joinClass', verifier.verifyToken, (req, res) => {
  StudentService.joinClass(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.post('/:classId/joinRollCall/:qhereId', verifier.verifyToken, (req, res) => {
  StudentService.joinRollCall(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.get('/:classId/getDiscontinuity', verifier.verifyToken, (req, res) => {
  StudentService.getDiscontinuity(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

module.exports = router;
