import { Link, Outlet, useLocation } from 'react-router-dom'
import { Users, Plus, Home } from 'lucide-react'

function Layout() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Gestionnaire de Contacts
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="h-4 w-4" />
                Accueil
              </Link>
              <Link
                to="/contacts/add"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/contacts/add')
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Plus className="h-4 w-4" />
                Nouveau Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
