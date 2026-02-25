import { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'

const ProductGrid = ({ category, onEdit }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [contextMenu, setContextMenu] = useState(null)
  
  useEffect(() => {
    fetchProducts()
    document.addEventListener('click', closeContextMenu)
    return () => document.removeEventListener('click', closeContextMenu)
  }, [category])

  const fetchProducts = async () => {
    try {
      const { data } = await adminAPI.get(`/products/category/${category._id}`)
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const closeContextMenu = () => setContextMenu(null)

  const handleRightClick = (e, product) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, product })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await adminAPI.delete(`/products/${id}`)
      setProducts(products.filter(p => p._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDuplicate = async (id) => {
    try {
      const { data } = await adminAPI.post(`/products/${id}/duplicate`)
      setProducts([...products, data])
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p className='text-zinc-500 text-sm'>Loading...</p>

  if (products.length === 0) return (
    <p className='text-zinc-500 text-sm'>No products yet. Create one to get started.</p>
  )

  return (
    <>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {products.map((product) => (
          <div
            key={product._id}
            onDoubleClick={() => onEdit(product)}
            onContextMenu={(e) => handleRightClick(e, product)}
            className='bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-2xl overflow-hidden cursor-pointer group transition'
          >
            {/* Product Image */}
            <div className='aspect-video bg-zinc-800 overflow-hidden'>
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-4xl'>
                  🎸
                </div>
              )}
            </div>
            {/* Product Info */}
            <div className='px-4 py-3'>
              <p className='text-white text-sm font-medium truncate'>{product.name}</p>
              <div className='flex items-center justify-between mt-1'>
                <span className='text-amber-400 text-xs font-semibold'>${product.price}</span>
                <span className='text-zinc-500 text-xs'>Qty: {product.countInStock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className='fixed z-50 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-2 min-w-44'
        >
          <button
            onClick={() => { onEdit(contextMenu.product); setContextMenu(null) }}
            className='w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition'
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => { handleDuplicate(contextMenu.product._id); setContextMenu(null) }}
            className='w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition'
          >
            📋 Duplicate
          </button>
          <div className='border-t border-zinc-800 my-1' />
          <button
            onClick={() => { handleDelete(contextMenu.product._id); setContextMenu(null) }}
            className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition'
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </>
  )
}

export default ProductGrid