import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const { cartItems } = useCart()
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <nav className='bg-crayola-950 border-b border-crayola-900 px-6 py-4 flex items-center justify-between sticky top-0 z-50'>
      {/* Logo */}
      <Link to='/' className='flex items-center gap-2'>
        <span className='text-almond-300 font-bold text-xl tracking-tight'>Mondragon</span>
        <span className='text-camel-500 text-sm font-medium'>Guitars</span>
      </Link>

      {/* Nav Links */}
      <div className='flex items-center gap-8'>
        <Link
          to='/'
          className='text-crayola-200 hover:text-almond-300 text-sm font-medium transition'
        >
          Home
        </Link>
        <Link
          to='/shop'
          className='text-crayola-200 hover:text-almond-300 text-sm font-medium transition'
        >
          Shop
        </Link>
      </div>

      {/* Cart */}
      <Link to='/cart' className='relative flex items-center gap-2 bg-crayola-800 hover:bg-crayola-700 px-4 py-2 rounded-lg transition'>
        <span className='text-crayola-200 text-sm'>🛒</span>
        <span className='text-crayola-200 text-sm font-medium'>Cart</span>
        {totalItems > 0 && (
          <span className='absolute -top-2 -right-2 bg-almond-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
            {totalItems}
          </span>
        )}
      </Link>
    </nav>
  )
}

export default Navbar