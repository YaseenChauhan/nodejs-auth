module.exports = (res, success, message = '', isError = false, data = {}, statusCode = 200) => {
    if (!isError) {
      return res
        .status(statusCode)
        .json({
          success,
          message,
          data,
        });
    }
    return res
      .status((statusCode >= 200 && statusCode <= 300) ? 500 : statusCode)
      .json({
        success: false,
        message,
        data,
      });
  };