const express = require('express');
const router = express.Router();
const respond = require('../helpers/respond');
const verifier = require('../helpers/verifier');
const TokenService = require('../services/TokenService.js');

router.get('/verifyToken', verifier.verifyToken, function (req, res, next) {
    respond.success(res);
});

module.exports = router;