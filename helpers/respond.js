const respondSuccess = function(res, data) {
  return res.status(200).json({
    statusCode: 200,
    data
  });
};

const respondWithError = function(res, error, statusCode) {
  if (error !== undefined && error.statusCode !== undefined) statusCode = error.statusCode;
  else if (statusCode == undefined) statusCode = 500;
  return res.status(statusCode).json({
    statusCode,
    error: error.message
  });
};

module.exports = {
  success: respondSuccess,
  withError: respondWithError
};
