import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../../utils/api'
import CategoryModal from '../../components/CategoryModal'
import ProductGrid from '../../components/ProductGrid'
import ProductModal from '../../components/ProductModal'

const AdminProducts = () => {
  const navigate = useNavigate()
  const [currentCategory, setCurrentCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [contextMenu, setContextMenu] = useState(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchCategories()
    document.addEventListener('click', closeContextMenu)
    return () => document.removeEventListener('click', closeContextMenu)
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await adminAPI.get('/categories')
      setCategories(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const closeContextMenu = () => setContextMenu(null)

  const handleRightClick = (e, category) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, category })
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await adminAPI.delete(`/categories/${id}`)
      setCategories(categories.filter(c => c._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='min-h-screen bg-zinc-950 text-white'>
      {/* Header */}
      <header className='border-b border-zinc-800 px-8 py-5 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => currentCategory ? setCurrentCategory(null) : navigate('/admin/dashboard')}
            className='text-zinc-400 hover:text-white transition text-sm flex items-center gap-2'
          >
            ← Back
          </button>
          <span className='text-zinc-700'>|</span>
          <div className='flex items-center gap-2 text-sm'>
            <span
              onClick={() => setCurrentCategory(null)}
              className='text-zinc-400 hover:text-white cursor-pointer transition'
            >
              Products
            </span>
            {currentCategory && (
              <>
                <span className='text-zinc-700'>/</span>
                <span className='text-white font-medium'>{currentCategory.name}</span>
              </>
            )}
          </div>
        </div>
        <button
            onClick={() => {
                if (currentCategory) {
                setEditingProduct(null)
                setShowProductModal(true)
                } else {
                setEditingCategory(null)
                setShowCategoryModal(true)
                }
            }}
            className='bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition'
            >
            + New {currentCategory ? 'Product' : 'Category'}
        </button>
      </header>

      {/* Main */}
      <main className='px-8 py-10'>
        {!currentCategory ? (
          <>
            <h2 className='text-zinc-400 text-sm uppercase tracking-widest mb-6'>Categories</h2>
            {loading ? (
              <p className='text-zinc-500 text-sm'>Loading...</p>
            ) : categories.length === 0 ? (
              <p className='text-zinc-500 text-sm'>No categories yet. Create one to get started.</p>
            ) : (
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                {categories.map((category) => (
                  <div
                    key={category._id}
                    onDoubleClick={() => setCurrentCategory(category)}
                    onContextMenu={(e) => handleRightClick(e, category)}
                    className='bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-2xl overflow-hidden cursor-pointer group transition'
                  >
                    {/* Folder Image */}
                    <div className='aspect-video bg-zinc-800 overflow-hidden'>
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-4xl'>
                          📁
                        </div>
                      )}
                    </div>
                    {/* Folder Label */}
                    <div className='px-4 py-3'>
                      <p className='text-white text-sm font-medium truncate'>{category.name}</p>
                      {category.description && (
                        <p className='text-zinc-500 text-xs mt-0.5 truncate'>{category.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className='text-zinc-400 text-sm uppercase tracking-widest mb-6'>
            {currentCategory.name}
            </h2>
            <ProductGrid
              key={refreshKey}
              category={currentCategory}
              onEdit={(product) => { setEditingProduct(product); setShowProductModal(true) }}
            />
          </>
        )}
      </main>

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className='fixed z-50 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-2 min-w-44'
        >
          <button
            onClick={() => { setEditingCategory(contextMenu.category); setShowCategoryModal(true); setContextMenu(null) }}
            className='w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition'
            >
            ✏️ Rename
            </button>
            <button
            onClick={() => { setEditingCategory(contextMenu.category); setShowCategoryModal(true); setContextMenu(null) }}
            className='w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition'
            >
            🖼️ Change Image
          </button>
          <div className='border-t border-zinc-800 my-1' />
          <button
            onClick={() => { handleDeleteCategory(contextMenu.category._id); setContextMenu(null) }}
            className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition'
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
            existing={editingCategory}
            onClose={() => { setShowCategoryModal(false); setEditingCategory(null) }}
            onSave={(saved) => {
            if (editingCategory) {
                setCategories(categories.map(c => c._id === saved._id ? saved : c))
            } else {
                setCategories([...categories, saved])
            }
          }}
        />
      )}

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
            existing={editingProduct}
            category={currentCategory}
            onClose={() => { setShowProductModal(false); setEditingProduct(null) }}
            onSave={(saved) => {
                setRefreshKey(prev => prev + 1)
            }}
        />
      )}
    </div>
  )
}

export default AdminProducts