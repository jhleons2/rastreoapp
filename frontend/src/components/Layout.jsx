import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Smartphone, MapPin, Navigation, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children, onLogout }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/devices', icon: Smartphone, label: 'Dispositivos' },
    { path: '/locations', icon: MapPin, label: 'Ubicaciones' },
    { path: '/tracking', icon: Navigation, label: 'Métodos de Rastreo' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-blue-600">
                📍 RastreoApp
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed lg:translate-x-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out mt-16 lg:static lg:z-auto`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

