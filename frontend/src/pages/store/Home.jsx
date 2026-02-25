import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { publicAPI } from '../../utils/api'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await publicAPI.get('/products')
        setProducts(data.slice(0, 4))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className='min-h-screen bg-crayola-950'>
      {/* Hero */}
      <section className='relative px-6 py-32 flex flex-col items-center justify-center text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-crayola-900 to-crayola-950 opacity-90' />
        <div className='relative z-10 max-w-3xl mx-auto'>
          <p className='text-camel-400 text-sm uppercase tracking-widest mb-4 font-medium'>
            Handcrafted in the USA
          </p>
          <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 leading-tight'>
            Mondragon
            <span className='block text-almond-300'>Guitars</span>
          </h1>
          <p className='text-crayola-300 text-lg mb-10 max-w-xl mx-auto'>
            Premium guitar parts built for tone, feel, and lasting quality. Every neck tells a story.
          </p>
          <div className='flex items-center justify-center gap-4'>
            <Link
              to='/shop'
              className='bg-almond-500 hover:bg-almond-400 text-white font-semibold px-8 py-4 rounded-xl transition text-sm'
            >
              Shop Now
            </Link>
            <Link
              to='/shop'
              className='border border-crayola-700 hover:border-crayola-500 text-crayola-300 hover:text-white font-medium px-8 py-4 rounded-xl transition text-sm'
            >
              View Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='px-6 py-16 border-t border-crayola-900'>
        <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            { icon: '🎸', title: 'Premium Wood', desc: 'Carefully selected tonewoods for optimal resonance and sustain.' },
            { icon: '🔧', title: 'Custom Options', desc: 'Choose your fret count, radius, and finish to match your style.' },
            { icon: '🚚', title: 'Fast Shipping', desc: 'Ships within 2-3 business days from our workshop.' },
          ].map((f, i) => (
            <div key={i} className='bg-crayola-900 border border-crayola-800 rounded-2xl p-6 text-center'>
              <div className='text-4xl mb-4'>{f.icon}</div>
              <h3 className='text-almond-300 font-semibold mb-2'>{f.title}</h3>
              <p className='text-crayola-400 text-sm'>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className='px-6 py-16'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-white text-2xl font-bold'>Featured Products</h2>
            <Link to='/shop' className='text-crayola-400 hover:text-almond-300 text-sm transition'>
              View all →
            </Link>
          </div>

          {loading ? (
            <p className='text-crayola-500 text-sm'>Loading...</p>
          ) : products.length === 0 ? (
            <p className='text-crayola-500 text-sm'>No products yet.</p>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {products.map(product => (
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
                    <h3 className='text-white font-medium text-sm truncate'>{product.name}</h3>
                    <p className='text-almond-400 font-semibold mt-1'>${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-crayola-900 px-6 py-8 text-center'>
        <p className='text-crayola-600 text-sm'>© 2026 Mondragon Guitars. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home