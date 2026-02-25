import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminAPI } from '../../utils/api'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await adminAPI.post('/auth/login', { 
        email: email.toLowerCase().trim(), 
        password 
      })
      if (!data.isAdmin) {
        setError('Access denied. Admins only.')
        return
      }
      login(data)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-zinc-950 flex items-center justify-center'>
      <div className='bg-zinc-900 border border-zinc-800 rounded-2xl p-10 w-full max-w-md shadow-2xl'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-white tracking-tight'>Mondragon</h1>
          <p className='text-zinc-500 mt-1 text-sm'>Admin Portal</p>
        </div>

        {error && (
          <div className='bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='text-zinc-400 text-sm mb-1 block'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition'
              placeholder='admin@mondragon.com'
              required
            />
          </div>

          <div>
            <label className='text-zinc-400 text-sm mb-1 block'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition'
              placeholder='••••••••'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg px-4 py-3 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin