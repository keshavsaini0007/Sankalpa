require("dotenv").config()
const express = require("express")
const cors = require("cors")
const userRouter = require("./routes/user.route")
const taskRouter = require("./routes/task.route")
const errorMiddleware = require("./middlewares/error.middleware")

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tasks", taskRouter)

app.use(errorMiddleware)

module.exports = app
