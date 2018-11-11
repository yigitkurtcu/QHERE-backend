const express = require('express');
const router = express.Router();
const respond = require('../helpers/respond');
const TokenService = require('../services/TokenService.js');

router.get('/verifyToken', function (req, res, next) {
    TokenService.verifyToken(req.headers.authorization).then((result) => {
        req.tokenData = result;
        respond.success(res, result);
    }).catch((err) => {
        respond.withError(res, err);
    });
});

module.exports = router;