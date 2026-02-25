import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'

const CategoryModal = ({ onClose, onSave, existing }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existing) {
      setName(existing.name || '')
      setDescription(existing.description || '')
      setImage(existing.image || '')
    }
  }, [existing])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      const { data } = await adminAPI.post('/products/upload', formData)
      setImage(`http://localhost:${import.meta.env.VITE_ADMIN_API.split(':')[2].split('/')[0]}${data.image}`)
    } catch (err) {
      setError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (existing) {
        const { data } = await adminAPI.put(`/categories/${existing._id}`, { name, description, image })
        onSave(data)
      } else {
        const { data } = await adminAPI.post('/categories', { name, description, image })
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
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-2xl'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-white font-semibold text-lg'>
            {existing ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className='text-zinc-500 hover:text-white transition text-xl'>✕</button>
        </div>

        {error && (
          <div className='bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-5'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='text-zinc-400 text-sm mb-1 block'>Name</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition'
              placeholder='e.g. Guitar Necks'
              required
            />
          </div>

          <div>
            <label className='text-zinc-400 text-sm mb-1 block'>Description</label>
            <input
              type='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition'
              placeholder='Optional description'
            />
          </div>

          <div>
            <label className='text-zinc-400 text-sm mb-1 block'>Image</label>
            {image && (
              <img src={image} alt='preview' className='w-full h-32 object-cover rounded-lg mb-2' />
            )}
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='w-full bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition'
            />
            {uploading && <p className='text-zinc-500 text-xs mt-1'>Uploading...</p>}
          </div>

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
              {loading ? 'Saving...' : existing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryModal