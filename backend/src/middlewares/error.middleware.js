const ApiResponse = require("../utils/apiResponse")

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || "Internal Server Error"

  if (err.name === "CastError") {
    statusCode = 400
    message = "Invalid ID format"
  }

  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue)[0]
    message = `${field} already exists`
  }

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, null, message))
}

module.exports = errorMiddleware
