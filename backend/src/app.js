require("dotenv").config()
const express = require("express")
const cors = require("cors")
const userRouter = require("./routes/user.route")
const taskRouter = require("./routes/task.route")
const errorMiddleware = require("./middlewares/error.middleware")

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map(s => s.trim())
      : ["http://localhost:5173", "https://sankalpa-todo.vercel.app"],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tasks", taskRouter)

app.use(errorMiddleware)

module.exports = app
