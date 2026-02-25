import mongoose from 'mongoose'

const optionSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g. "Frets"
  type: { type: String, enum: ['button', 'dropdown'], default: 'button' },
  choices: [{ type: String }], // e.g. ["21", "22", "24", "Fretless"]
})

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  options: [optionSchema],
}, {
  timestamps: true
})

export default mongoose.model('Product', productSchema)