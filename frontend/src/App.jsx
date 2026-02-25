import { Routes, Route } from 'react-router-dom'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/store/Home'
import Shop from './pages/store/Shop'
import ProductDetail from './pages/store/ProductDetail'
import Cart from './pages/store/Cart'
import Checkout from './pages/store/Checkout'
import OrderConfirmation from './pages/store/OrderConfirmation'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Routes>
        {/* Admin Routes - no navbar */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin' element={<ProtectedRoute />}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='products' element={<AdminProducts />} />
        </Route>

        {/* Store Routes - with navbar */}
        <Route path='/*' element={
          <>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/shop' element={<Shop />} />
              <Route path='/product/:id' element={<ProductDetail />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/order-confirmation' element={<OrderConfirmation />} />
            </Routes>
          </>
        } />
      </Routes>
    </>
  )
}

export default App