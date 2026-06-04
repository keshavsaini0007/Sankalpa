const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const ApiError = require("../utils/apiError")
const ApiResponse = require("../utils/apiResponse")
const asyncHandler = require("../utils/asyncHandler")

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  )
}

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields required")
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format")
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters")
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new ApiError(409, "Email already registered")
  }

  const user = await User.create({ name, email, password })

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { _id: user._id, name: user.name, email: user.email },
        "Registered successfully"
      )
    )
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, "All fields required")
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(401, "Invalid credentials")
  }

  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials")
  }

  const token = generateToken(user)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { token, user: { _id: user._id, name: user.name, email: user.email } },
        "Login successful"
      )
    )
})

module.exports = { registerUser, loginUser }
