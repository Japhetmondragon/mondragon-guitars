import express from 'express'
import multer from 'multer'
import path from 'path'
import Product from '../models/Product.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (extname) return cb(null, true)
    cb(new Error('Images only!'))
  },
})

// GET all products
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find().populate('category')
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET products by category
router.get('/category/:categoryId', protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId }).populate('category')
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET single product
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// CREATE product
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, countInStock, category, options, images } = req.body
    const product = await Product.create({ name, description, price, countInStock, category, options, images })
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// UPDATE product
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DUPLICATE product
router.post('/:id/duplicate', protect, adminOnly, async (req, res) => {
  try {
    const original = await Product.findById(req.params.id)
    if (!original) return res.status(404).json({ message: 'Product not found' })
    const { _id, createdAt, updatedAt, __v, ...data } = original.toObject()
    const duplicate = await Product.create({ ...data, name: `${data.name} (Copy)` })
    res.status(201).json(duplicate)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE product
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// UPLOAD image
router.post('/upload', protect, adminOnly, upload.single('image'), (req, res) => {
  res.json({ image: `/${req.file.path}` })
})

export default router