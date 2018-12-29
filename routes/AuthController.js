const express = require('express');
const respond = require('../helpers/respond');
const verifier = require('../helpers/verifier');

const router = express.Router();

router.get('/verifyToken', verifier.verifyToken, (req, res) => {
  respond.success(res);
});

module.exports = router;
