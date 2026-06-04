const { Router } = require("express")
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} = require("../controllers/task.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = Router()

router.use(authMiddleware)

router.get("/", getTasks)
router.post("/", createTask)
router.patch("/:taskId/toggle", toggleTaskStatus)
router.patch("/:taskId", updateTask)
router.delete("/:taskId", deleteTask)

module.exports = router
