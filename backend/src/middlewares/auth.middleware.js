const jwt = require("jsonwebtoken")
const ApiError = require("../utils/apiError")
const asyncHandler = require("../utils/asyncHandler")

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized")
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { _id: decoded._id, email: decoded.email }
    next()
  } catch (error) {
    throw new ApiError(401, "Unauthorized")
  }
})

module.exports = authMiddleware
