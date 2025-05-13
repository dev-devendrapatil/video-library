import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './db/index.js'

dotenv.config({
  path:"./env/.env"
})
const app = express()
const PORT = process.env.PORT || 3000
connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
}
)

