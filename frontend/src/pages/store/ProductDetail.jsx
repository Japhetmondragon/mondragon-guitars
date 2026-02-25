import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { publicAPI } from '../../utils/api'
import { useCart } from '../../context/CartContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await publicAPI.get(`/products/${id}`)
        setProduct(data)
        // set default options
        const defaults = {}
        data.options?.forEach(opt => {
          defaults[opt.label] = opt.choices[0]
        })
        setSelectedOptions(defaults)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, selectedOptions, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className='min-h-screen bg-crayola-950 flex items-center justify-center'>
      <p className='text-crayola-400'>Loading...</p>
    </div>
  )

  if (!product) return (
    <div className='min-h-screen bg-crayola-950 flex items-center justify-center'>
      <p className='text-crayola-400'>Product not found.</p>
    </div>
  )

  return (
    <div className='min-h-screen bg-crayola-950'>
      <div className='max-w-6xl mx-auto px-6 py-12'>
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className='text-crayola-400 hover:text-white text-sm mb-8 flex items-center gap-2 transition'
        >
          ← Back
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Images */}
          <div>
            <div className='aspect-square bg-crayola-900 rounded-2xl overflow-hidden border border-crayola-800 mb-4'>
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-6xl'>🎸</div>
              )}
            </div>
            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div className='flex gap-3'>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === i ? 'border-almond-400' : 'border-crayola-800'
                    }`}
                  >
                    <img src={img} alt='' className='w-full h-full object-cover' />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className='text-camel-400 text-sm uppercase tracking-widest mb-2'>
              {product.category?.name}
            </p>
            <h1 className='text-3xl font-bold text-white mb-3'>{product.name}</h1>
            <p className='text-almond-400 text-3xl font-semibold mb-6'>${product.price}</p>
            <p className='text-crayola-300 text-sm leading-relaxed mb-8'>{product.description}</p>

            {/* Options */}
            {product.options?.map((option, i) => (
              <div key={i} className='mb-6'>
                <label className='text-crayola-400 text-sm uppercase tracking-widest mb-3 block'>
                  {option.label}
                </label>
                {option.type === 'button' ? (
                  <div className='flex flex-wrap gap-2'>
                    {option.choices.map((choice, j) => (
                      <button
                        key={j}
                        onClick={() => setSelectedOptions({ ...selectedOptions, [option.label]: choice })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                          selectedOptions[option.label] === choice
                            ? 'bg-almond-500 border-almond-500 text-white'
                            : 'bg-crayola-900 border-crayola-700 text-crayola-300 hover:border-almond-400'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                ) : (
                  <select
                    value={selectedOptions[option.label] || ''}
                    onChange={(e) => setSelectedOptions({ ...selectedOptions, [option.label]: e.target.value })}
                    className='bg-crayola-900 border border-crayola-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-almond-400 transition'
                  >
                    {option.choices.map((choice, j) => (
                      <option key={j} value={choice}>{choice}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            {/* Quantity */}
            <div className='mb-8'>
              <label className='text-crayola-400 text-sm uppercase tracking-widest mb-3 block'>Quantity</label>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className='w-10 h-10 rounded-lg bg-crayola-900 border border-crayola-700 text-white hover:border-almond-400 transition flex items-center justify-center'
                >
                  −
                </button>
                <span className='text-white font-medium w-8 text-center'>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.countInStock, q + 1))}
                  className='w-10 h-10 rounded-lg bg-crayola-900 border border-crayola-700 text-white hover:border-almond-400 transition flex items-center justify-center'
                >
                  +
                </button>
                <span className='text-crayola-500 text-sm ml-2'>{product.countInStock} in stock</span>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className='w-full bg-almond-500 hover:bg-almond-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition text-sm'
            >
              {added ? '✓ Added to Cart!' : product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
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

export default ProductDetail