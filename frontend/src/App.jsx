import { Routes, Route } from 'react-router-dom'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path='/admin/login' element={<AdminLogin />} />
      <Route path='/admin' element={<ProtectedRoute />}>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='products' element={<AdminProducts />} />
      </Route>
    </Routes>
  )
}

export default App