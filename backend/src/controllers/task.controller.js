const mongoose = require("mongoose")
const Task = require("../models/task.model")
const ApiError = require("../utils/apiError")
const ApiResponse = require("../utils/apiResponse")
const asyncHandler = require("../utils/asyncHandler")

const getTasks = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query

  const filter = { userId: req.user._id }

  if (status && ["pending", "completed"].includes(status)) {
    filter.status = status
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ]
  }

  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.max(1, parseInt(limit))
  const skip = (pageNum - 1) * limitNum

  const [tasks, total] = await Promise.all([
    Task.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    Task.countDocuments(filter),
  ])

  const totalPages = Math.ceil(total / limitNum)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { tasks, total, page: pageNum, totalPages },
        "Tasks fetched successfully"
      )
    )
})

const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body

  if (!title) {
    throw new ApiError(400, "Title is required")
  }

  const task = await Task.create({
    title,
    description: description || "",
    userId: req.user._id,
  })

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created"))
})

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params

  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, "Invalid task ID")
  }

  const task = await Task.findById(taskId)
  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  if (task.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden")
  }

  const allowedFields = ["title", "description", "status"]
  const updates = {}
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field]
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
    new: true,
    runValidators: true,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated"))
})

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params

  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, "Invalid task ID")
  }

  const task = await Task.findById(taskId)
  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  if (task.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden")
  }

  await Task.findByIdAndDelete(taskId)

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted"))
})

const toggleTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params

  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, "Invalid task ID")
  }

  const task = await Task.findById(taskId)
  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  if (task.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden")
  }

  task.status = task.status === "pending" ? "completed" : "pending"
  await task.save()

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Status toggled"))
})

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
}
