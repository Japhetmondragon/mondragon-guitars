import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'

const ProductModal = ({ onClose, onSave, existing, category }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [images, setImages] = useState([])
  const [options, setOptions] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existing) {
      setName(existing.name || '')
      setDescription(existing.description || '')
      setPrice(existing.price || '')
      setCountInStock(existing.countInStock || '')
      setImages(existing.images || [])
      setOptions(existing.options || [])
    }
  }, [existing])

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    setUploading(true)
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData()
          formData.append('image', file)
          const { data } = await adminAPI.post('/products/upload', formData)
          return `${import.meta.env.VITE_ADMIN_API.replace('/api', '')}${data.image}`
        })
      )
      setImages([...images, ...uploaded])
    } catch (err) {
      setError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // Options handlers
  const addOption = () => {
    setOptions([...options, { label: '', type: 'button', choices: [] }])
  }

  const updateOption = (index, field, value) => {
    const updated = [...options]
    updated[index][field] = value
    setOptions(updated)
  }

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const addChoice = (optionIndex) => {
    const updated = [...options]
    updated[optionIndex].choices.push('')
    setOptions(updated)
  }

  const updateChoice = (optionIndex, choiceIndex, value) => {
    const updated = [...options]
    updated[optionIndex].choices[choiceIndex] = value
    setOptions(updated)
  }

  const removeChoice = (optionIndex, choiceIndex) => {
    const updated = [...options]
    updated[optionIndex].choices = updated[optionIndex].choices.filter((_, i) => i !== choiceIndex)
    setOptions(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        name,
        description,
        price: Number(price),
        countInStock: Number(countInStock),
        images,
        options,
        category: category._id,
      }
      if (existing) {
        const { data } = await adminAPI.put(`/products/${existing._id}`, payload)
        onSave(data)
      } else {
        const { data } = await adminAPI.post('/products', payload)
        onSave(data)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-8 pb-0'>
          <h2 className='text-white font-semibold text-lg'>
            {existing ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose} className='text-zinc-500 hover:text-white transition text-xl'>✕</button>
        </div>

        {error && (
          <div className='mx-8 mt-5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='p-8 space-y-6'>
          {/* Name */}
          <div>
            <label className='text-zinc-400 text-sm mb-1 block'>Name</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition'
              placeholder='e.g. Maple Guitar Neck'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className='text-zinc-400 text-sm mb-1 block'>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className='w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition resize-none'
              placeholder='Describe your product...'
              required
            />
          </div>

          {/* Price & Stock */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-zinc-400 text-sm mb-1 block'>Price ($)</label>
              <input
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition'
                placeholder='0.00'
                required
              />
            </div>
            <div>
              <label className='text-zinc-400 text-sm mb-1 block'>Quantity in Stock</label>
              <input
                type='number'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className='w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition'
                placeholder='0'
                required
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className='text-zinc-400 text-sm mb-2 block'>Images</label>
            {images.length > 0 && (
              <div className='flex gap-2 flex-wrap mb-3'>
                {images.map((img, i) => (
                  <div key={i} className='relative'>
                    <img src={img} alt='' className='w-20 h-20 object-cover rounded-lg' />
                    <button
                      type='button'
                      onClick={() => removeImage(i)}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center'
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              type='file'
              accept='image/*'
              multiple
              onChange={handleImageUpload}
              className='w-full bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition'
            />
            {uploading && <p className='text-zinc-500 text-xs mt-1'>Uploading...</p>}
          </div>

          {/* Options */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <label className='text-zinc-400 text-sm'>Custom Options</label>
              <button
                type='button'
                onClick={addOption}
                className='text-amber-400 hover:text-amber-300 text-xs transition'
              >
                + Add Option
              </button>
            </div>

            {options.length === 0 && (
              <p className='text-zinc-600 text-xs'>No options yet. Add one for things like frets, wood type, etc.</p>
            )}

            <div className='space-y-4'>
              {options.map((option, oi) => (
                <div key={oi} className='bg-zinc-800 rounded-xl p-4 border border-zinc-700'>
                  <div className='flex gap-3 mb-3'>
                    <input
                      type='text'
                      value={option.label}
                      onChange={(e) => updateOption(oi, 'label', e.target.value)}
                      className='flex-1 bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition'
                      placeholder='Option label (e.g. Frets)'
                    />
                    <select
                      value={option.type}
                      onChange={(e) => updateOption(oi, 'type', e.target.value)}
                      className='bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition'
                    >
                      <option value='button'>Button</option>
                      <option value='dropdown'>Dropdown</option>
                    </select>
                    <button
                      type='button'
                      onClick={() => removeOption(oi)}
                      className='text-red-400 hover:text-red-300 text-sm transition'
                    >
                      ✕
                    </button>
                  </div>

                  {/* Choices */}
                  <div className='space-y-2'>
                    {option.choices.map((choice, ci) => (
                      <div key={ci} className='flex gap-2'>
                        <input
                          type='text'
                          value={choice}
                          onChange={(e) => updateChoice(oi, ci, e.target.value)}
                          className='flex-1 bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition'
                          placeholder={`Choice ${ci + 1} (e.g. 21)`}
                        />
                        <button
                          type='button'
                          onClick={() => removeChoice(oi, ci)}
                          className='text-red-400 hover:text-red-300 text-sm transition'
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type='button'
                      onClick={() => addChoice(oi)}
                      className='text-zinc-400 hover:text-white text-xs transition'
                    >
                      + Add Choice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white text-sm font-medium px-4 py-3 rounded-lg transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading || uploading}
              className='flex-1 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-3 rounded-lg transition disabled:opacity-50'
            >
              {loading ? 'Saving...' : existing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductModal