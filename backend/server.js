import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import { fileURLToPath } from 'url'
import path from 'path'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
  origin: process.env.PUBLIC_CLIENT_URL
}))
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err))

app.get('/', (req, res) => {
  res.send('Mondragon Guitars API is running')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))