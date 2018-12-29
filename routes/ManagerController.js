const express = require('express');
const respond = require('../helpers/respond');
const verifier = require('../helpers/verifier');
const ManagerService = require('../services/ManagerService.js');

const router = express.Router();

router.post('/createClass', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.createClass(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.get('/getClasses', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.getClasses(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.get('/getClassesRequest', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.getClassesRequest(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.put('/:id/approveStudent', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.approveStudents(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.post('/:id/rejectStudent', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.rejectStudents(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.get('/class/:id/info', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.getClassInfo(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.delete('/:id/deleteClass', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.deleteClass(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.put('/:id/updateClass', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.updateClass(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.put('/createQr', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.createQr(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.get('/getQrInfo/:id', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.getQrInfo(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.post('/sendNotification', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.sendNotification(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

router.get('/makeReport/:id', [verifier.verifyToken, verifier.verifyManager], (req, res) => {
  ManagerService.makeReport(req)
    .then(result => {
      respond.success(res, result);
    })
    .catch(err => {
      respond.withError(res, err);
    });
});

module.exports = router;
