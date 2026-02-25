import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { publicAPI } from '../../utils/api'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        publicAPI.get('/products'),
        publicAPI.get('/categories/public'),
      ])
      setProducts(productsRes.data)
      setCategories(categoriesRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = selectedCategory
    ? products.filter(p => p.category?._id === selectedCategory)
    : products

  return (
    <div className='min-h-screen bg-crayola-950'>
      <div className='max-w-7xl mx-auto px-6 py-12'>
        {/* Header */}
        <div className='mb-10'>
          <h1 className='text-3xl font-bold text-white mb-2'>Shop</h1>
          <p className='text-crayola-400 text-sm'>Browse our collection of premium guitar parts</p>
        </div>

        <div className='flex gap-8'>
          {/* Sidebar */}
          <aside className='w-48 shrink-0'>
            <h3 className='text-crayola-400 text-xs uppercase tracking-widest mb-4'>Categories</h3>
            <div className='space-y-1'>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  !selectedCategory
                    ? 'bg-crayola-800 text-almond-300 font-medium'
                    : 'text-crayola-400 hover:text-white hover:bg-crayola-900'
                }`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    selectedCategory === cat._id
                      ? 'bg-crayola-800 text-almond-300 font-medium'
                      : 'text-crayola-400 hover:text-white hover:bg-crayola-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Product Grid */}
          <div className='flex-1'>
            {loading ? (
              <p className='text-crayola-500 text-sm'>Loading...</p>
            ) : filtered.length === 0 ? (
              <p className='text-crayola-500 text-sm'>No products found.</p>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filtered.map(product => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className='bg-crayola-900 border border-crayola-800 hover:border-almond-500/50 rounded-2xl overflow-hidden group transition'
                  >
                    <div className='aspect-video bg-crayola-800 overflow-hidden'>
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-4xl'>🎸</div>
                      )}
                    </div>
                    <div className='p-4'>
                      <h3 className='text-white font-medium truncate'>{product.name}</h3>
                      <p className='text-crayola-400 text-xs mt-1 truncate'>{product.description}</p>
                      <div className='flex items-center justify-between mt-3'>
                        <span className='text-almond-400 font-semibold'>${product.price}</span>
                        <span className={`text-xs ${product.countInStock > 0 ? 'text-turf-400' : 'text-red-400'}`}>
                          {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='border-t border-crayola-900 px-6 py-8 text-center mt-16'>
        <p className='text-crayola-600 text-sm'>© 2026 Mondragon Guitars. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Shop