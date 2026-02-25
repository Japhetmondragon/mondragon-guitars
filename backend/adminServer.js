import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import adminProductRoutes from './routes/adminProductRoutes.js'
import { fileURLToPath } from 'url'
import path from 'path'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors({
  origin: process.env.ADMIN_CLIENT_URL
}))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Admin MongoDB connected'))
  .catch((err) => console.log(err))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/products', adminProductRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)

app.get('/', (req, res) => {
  res.send('Mondragon Guitars ADMIN API is running')
})

const PORT = process.env.ADMIN_PORT || 5001
app.listen(PORT, () => console.log(`Admin server running on port ${PORT}`))