const respondSuccess = function (res, data) {
    console.log('Data :', data)
    return res.status(200).json({
        status_code: 200,
        data: data
    });
};

const respondWithError = function (res, error, status_code) {
    if(error.status_code != undefined)
        status_code = error.status_code
    else if(status_code == undefined)
        status_code = 500;
    return res.status(status_code).json({
        error
    })
};


module.exports = {
    success: respondSuccess,
    withError: respondWithError
};