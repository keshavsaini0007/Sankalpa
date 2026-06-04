require("dotenv").config()
const app = require("./app")
const connectDB = require("./db")

const PORT = process.env.PORT || 8000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Failed to start server: ", err.message)
    process.exit(1)
  })
