import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart()
  const navigate = useNavigate()

  if (cartItems.length === 0) return (
    <div className='min-h-screen bg-crayola-950 flex flex-col items-center justify-center gap-4'>
      <p className='text-6xl'>🛒</p>
      <h2 className='text-white text-xl font-semibold'>Your cart is empty</h2>
      <p className='text-crayola-400 text-sm'>Add some guitar parts to get started</p>
      <Link
        to='/shop'
        className='mt-4 bg-almond-500 hover:bg-almond-400 text-white font-semibold px-6 py-3 rounded-xl transition text-sm'
      >
        Browse Shop
      </Link>
    </div>
  )

  return (
    <div className='min-h-screen bg-crayola-950'>
      <div className='max-w-5xl mx-auto px-6 py-12'>
        <h1 className='text-3xl font-bold text-white mb-10'>Your Cart</h1>

        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Items */}
          <div className='flex-1 space-y-4'>
            {cartItems.map(item => (
              <div
                key={item.cartId}
                className='bg-crayola-900 border border-crayola-800 rounded-2xl p-5 flex gap-5'
              >
                {/* Image */}
                <div className='w-24 h-24 bg-crayola-800 rounded-xl overflow-hidden shrink-0'>
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} className='w-full h-full object-cover' />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-2xl'>🎸</div>
                  )}
                </div>

                {/* Info */}
                <div className='flex-1'>
                  <h3 className='text-white font-medium'>{item.name}</h3>

                  {/* Selected options */}
                  {Object.entries(item.selectedOptions || {}).map(([key, val]) => (
                    <p key={key} className='text-crayola-400 text-xs mt-0.5'>
                      {key}: <span className='text-crayola-300'>{val}</span>
                    </p>
                  ))}

                  <div className='flex items-center justify-between mt-3'>
                    {/* Quantity */}
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className='w-7 h-7 rounded-lg bg-crayola-800 border border-crayola-700 text-white hover:border-almond-400 transition flex items-center justify-center text-sm'
                      >
                        −
                      </button>
                      <span className='text-white text-sm w-6 text-center'>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className='w-7 h-7 rounded-lg bg-crayola-800 border border-crayola-700 text-white hover:border-almond-400 transition flex items-center justify-center text-sm'
                      >
                        +
                      </button>
                    </div>

                    <div className='flex items-center gap-4'>
                      <span className='text-almond-400 font-semibold'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className='text-crayola-600 hover:text-red-400 text-sm transition'
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className='w-full lg:w-72 shrink-0'>
            <div className='bg-crayola-900 border border-crayola-800 rounded-2xl p-6 sticky top-24'>
              <h2 className='text-white font-semibold text-lg mb-6'>Order Summary</h2>

              <div className='space-y-3 mb-6'>
                <div className='flex justify-between text-sm'>
                  <span className='text-crayola-400'>Subtotal</span>
                  <span className='text-white'>${cartTotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-crayola-400'>Shipping</span>
                  <span className='text-turf-400'>Calculated at checkout</span>
                </div>
                <div className='border-t border-crayola-800 pt-3 flex justify-between'>
                  <span className='text-white font-semibold'>Total</span>
                  <span className='text-almond-400 font-bold text-lg'>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className='w-full bg-almond-500 hover:bg-almond-400 text-white font-semibold py-4 rounded-xl transition text-sm'
              >
                Proceed to Checkout
              </button>

              <Link
                to='/shop'
                className='block text-center text-crayola-400 hover:text-white text-sm mt-4 transition'
              >
                ← Continue Shopping
              </Link>
            </div>
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

export default Cart