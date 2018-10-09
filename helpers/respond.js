const respondSuccess = function (res, data) {
    return res.status(200).json({
        status_code: 200,
        data: data
    });
};

const respondWithError = function (res, error, status_code) {
    error.status = status_code || error.status || 500;
    return res.status(error.status).json({
        error
    })
};

module.exports = {
    success: respondSuccess,
    withError: respondWithError
};