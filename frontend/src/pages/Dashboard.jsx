import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Smartphone, MapPin, Clock, Activity } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'https://rastreoapp-production.up.railway.app'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    devices: 0,
    locations: 0,
    lastActivity: 'Nunca',
    systemStatus: 'Desconocido',
    loading: true
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')

      const devicesRes = await fetch(`${API_URL}/api/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (devicesRes.ok) {
        const devices = await devicesRes.json()
        
        // Calcular última actividad y estado
        let lastActivity = null
        let activeDevices = 0
        
        devices.forEach(device => {
          if (device.is_active) activeDevices++
          if (device.last_seen) {
            const deviceLastSeen = new Date(device.last_seen)
            if (!lastActivity || deviceLastSeen > lastActivity) {
              lastActivity = deviceLastSeen
            }
          }
        })
        
        // Formatear última actividad
        let lastActivityText = 'Nunca'
        if (lastActivity) {
          const diffMs = Date.now() - lastActivity.getTime()
          const diffMins = Math.floor(diffMs / 60000)
          const diffHours = Math.floor(diffMins / 60)
          const diffDays = Math.floor(diffHours / 24)
          
          if (diffMins < 1) lastActivityText = 'Hace menos de 1 minuto'
          else if (diffMins < 60) lastActivityText = `Hace ${diffMins}m`
          else if (diffHours < 24) lastActivityText = `Hace ${diffHours}h`
          else lastActivityText = `Hace ${diffDays}d`
        }
        
        // Calcular estado del sistema
        const systemStatus = devices.length === 0 
          ? 'Sin dispositivos' 
          : activeDevices === 0 
            ? 'Sin actividad' 
            : activeDevices === devices.length 
              ? 'Activo' 
              : `${activeDevices}/${devices.length} activos`
        
        setStats({
          devices: devices.length || 0,
          locations: devices.reduce((acc, device) => acc + (device.location_count || 0), 0),
          lastActivity: lastActivityText,
          systemStatus: systemStatus,
          loading: false
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visión general del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Dispositivos</p>
              <p className="text-3xl font-bold mt-2">{stats.devices}</p>
            </div>
            <Smartphone className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Ubicaciones</p>
              <p className="text-3xl font-bold mt-2">{stats.locations}</p>
            </div>
            <MapPin className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Última Actividad</p>
              <p className="text-lg font-bold mt-2">{stats.lastActivity}</p>
            </div>
            <Clock className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Estado</p>
              <p className="text-lg font-bold mt-2">{stats.systemStatus}</p>
            </div>
            <Activity className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/devices')}
            className="btn-primary w-full py-3"
          >
            + Registrar Dispositivo
          </button>
          <button 
            onClick={() => navigate('/locations')}
            className="btn-secondary w-full py-3"
          >
            Ver Historial
          </button>
        </div>
      </div>
    </div>
  )
}

