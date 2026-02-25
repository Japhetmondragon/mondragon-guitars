import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const tools = [
  {
    id: 'products',
    label: 'Products',
    icon: '🎸',
    description: 'Manage your guitar parts catalog',
    path: '/admin/products',
  },
  // more tools can be added here later
]

const AdminDashboard = () => {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className='min-h-screen bg-zinc-950 text-white'>
      {/* Header */}
      <header className='border-b border-zinc-800 px-8 py-5 flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold tracking-tight'>Mondragon Guitars</h1>
          <p className='text-zinc-500 text-xs mt-0.5'>Admin Dashboard</p>
        </div>
        <div className='flex items-center gap-4'>
          <span className='text-zinc-400 text-sm'>👋 {admin?.name}</span>
          <button
            onClick={handleLogout}
            className='text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition'
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className='px-8 py-10'>
        <h2 className='text-zinc-400 text-sm uppercase tracking-widest mb-6'>Tools</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(tool.path)}
              className='bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 text-left transition group'
            >
              <div className='text-4xl mb-4'>{tool.icon}</div>
              <h3 className='text-white font-semibold text-sm group-hover:text-amber-400 transition'>
                {tool.label}
              </h3>
              <p className='text-zinc-500 text-xs mt-1'>{tool.description}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard