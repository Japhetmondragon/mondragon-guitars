import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5174' // admin frontend will run on different port
}))
app.use(express.json())
app.use('/api/auth', authRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Admin MongoDB connected'))
  .catch((err) => console.log(err))

app.get('/', (req, res) => {
  res.send('Mondragon Guitars ADMIN API is running')
})

const PORT = process.env.ADMIN_PORT || 5001
app.listen(PORT, () => console.log(`Admin server running on port ${PORT}`))