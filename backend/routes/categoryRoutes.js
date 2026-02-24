import express from 'express'
import Category from '../models/Category.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET all categories
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// CREATE category
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, image } = req.body
    const category = await Category.create({ name, description, image })
    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// UPDATE category
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE category
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json({ message: 'Category deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router