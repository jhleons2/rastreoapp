import { useState, useEffect } from 'react'
import { MapPin, Smartphone, Calendar, Navigation, MessageCircle, RefreshCw, Download, Share2, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Fix para iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const API_URL = import.meta.env.VITE_API_URL || 'https://rastreoapp-production.up.railway.app'

export default function Locations() {
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [showCharts, setShowCharts] = useState(false)

  useEffect(() => {
    fetchDevices()
  }, [])

  useEffect(() => {
    if (selectedDevice) {
      fetchLocations(selectedDevice)
    }
  }, [selectedDevice])

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (selectedDevice && autoRefresh) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refresh activado, actualizando ubicaciones...')
        fetchLocations(selectedDevice, true) // true = silent refresh
      }, 30000) // 30 segundos

      return () => clearInterval(interval)
    }
  }, [selectedDevice, autoRefresh])

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDevices(data)
        if (data.length > 0 && !selectedDevice) {
          setSelectedDevice(data[0].id)
        }
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching devices:', error)
      toast.error('Error al cargar dispositivos')
      setLoading(false)
    }
  }

  const fetchLocations = async (deviceId, silent = false) => {
    if (!silent) {
      setLoadingLocations(true)
    }
    
    try {
      const token = localStorage.getItem('token')
      console.log(`📍 Fetching locations for device ${deviceId}...`)
      
      const response = await fetch(`${API_URL}/api/locations/device/${deviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log(`📍 Response status: ${response.status}`)

      if (response.ok) {
        const data = await response.json()
        console.log(`📍 Received ${data.length} locations`)
        setLocations(data)
        setLastUpdate(new Date())
        
        if (!silent) {
          toast.success(`${data.length} ubicaciones cargadas`)
        }
      } else {
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        
        if (!silent) {
          toast.error('Error al cargar ubicaciones')
        }
      }
    } catch (error) {
      console.error('❌ Error fetching locations:', error)
      
      if (!silent) {
        toast.error(`Error al cargar ubicaciones: ${error.message}`)
      }
    } finally {
      if (!silent) {
        setLoadingLocations(false)
      }
    }
  }

  const handleManualRefresh = () => {
    if (selectedDevice) {
      console.log('🔄 Refrescando manualmente...')
      toast.loading('Actualizando ubicaciones...', { duration: 1000 })
      fetchLocations(selectedDevice)
    }
  }

  const handleExportCSV = async () => {
    if (!selectedDevice) {
      toast.error('Selecciona un dispositivo primero')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/locations/device/${selectedDevice}/export/csv`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ubicaciones_${selectedDevice}_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('CSV descargado exitosamente')
      } else {
        toast.error('Error al exportar CSV')
      }
    } catch (error) {
      console.error('Error exportando CSV:', error)
      toast.error('Error al exportar CSV')
    }
  }

  const handleShareWhatsApp = () => {
    if (locations.length === 0) {
      toast.error('No hay ubicaciones para compartir')
      return
    }

    const lastLocation = locations[0]
    const message = `📍 Mi ubicación actual:\nLatitud: ${lastLocation.latitude}\nLongitud: ${lastLocation.longitude}\nVer en mapa: https://www.google.com/maps?q=${lastLocation.latitude},${lastLocation.longitude}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
    toast.success('Compartiendo por WhatsApp')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ubicaciones</h1>
        <p className="text-gray-600 mt-2">Visualiza el historial de ubicaciones</p>
      </div>

      {/* Selector de Dispositivo */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Selecciona un dispositivo
          </label>
          <div className="flex gap-2 items-center flex-wrap">
            {/* Botón de refrescar manual */}
            <button
              onClick={handleManualRefresh}
              disabled={!selectedDevice || loadingLocations}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedDevice && !loadingLocations
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${loadingLocations ? 'animate-spin' : ''}`} />
              Refrescar
            </button>

            {/* Botón de exportar CSV */}
            <button
              onClick={handleExportCSV}
              disabled={!selectedDevice || locations.length === 0}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedDevice && locations.length > 0
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Exportar ubicaciones a CSV"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>

            {/* Botón de compartir WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              disabled={locations.length === 0}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                locations.length > 0
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Compartir última ubicación por WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp
            </button>

            {/* Botón de mostrar gráficos */}
            <button
              onClick={() => setShowCharts(!showCharts)}
              disabled={locations.length === 0}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                locations.length > 0
                  ? showCharts 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Mostrar/Ocultar gráficos"
            >
              <BarChart3 className="w-4 h-4" />
              {showCharts ? 'Ocultar' : 'Gráficos'}
            </button>
            
            {/* Toggle de auto-refresh */}
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              Auto-actualizar
            </label>
          </div>
        </div>
        
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
        ) : devices.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No hay dispositivos registrados
          </div>
        ) : (
          <select
            value={selectedDevice || ''}
            onChange={(e) => setSelectedDevice(Number(e.target.value))}
            className="input-field"
          >
            {devices.map(device => (
              <option key={device.id} value={device.id}>
                {device.device_name || `Dispositivo ${device.id}`} - {device.device_type}
              </option>
            ))}
          </select>
        )}
        
        {/* Mostrar última actualización */}
        {lastUpdate && (
          <p className="text-xs text-gray-500 mt-2">
            Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
          </p>
        )}
      </div>

      {/* Contenedor del Mapa */}
      <div className="card">
        {loadingLocations ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando ubicaciones...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ubicaciones</h3>
            <p className="text-gray-600">
              {selectedDevice ? 'Este dispositivo no tiene ubicaciones registradas' : 'Selecciona un dispositivo'}
            </p>
          </div>
        ) : (
          <>
            {/* Info del mapa */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Ubicaciones</p>
                    <p className="text-lg font-bold text-gray-900">{locations.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Desde</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(locations[locations.length - 1]?.timestamp).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Última Ubicación</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(locations[0]?.timestamp).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa real con Leaflet */}
            {locations.length > 0 && (
              <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height: '500px' }}>
                <MapContainer
                  center={[Number(locations[0].latitude), Number(locations[0].longitude)]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Marcadores de ubicaciones */}
                  {locations.map((location, index) => (
                    <Marker 
                      key={location.id || index}
                      position={[Number(location.latitude), Number(location.longitude)]}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-bold">Ubicación #{locations.length - index}</p>
                          <p className="text-gray-600 mt-1">
                            {new Date(location.timestamp).toLocaleString('es-ES')}
                          </p>
                          {location.accuracy && (
                            <p className="text-gray-500">
                              Precisión: {location.accuracy}m
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Línea conectando todas las ubicaciones */}
                  {locations.length > 1 && (
                    <Polyline
                      positions={locations.map(loc => [Number(loc.latitude), Number(loc.longitude)])}
                      color="blue"
                      weight={3}
                      opacity={0.7}
                    />
                  )}
                </MapContainer>
              </div>
            )}

            {/* Gráficos de análisis */}
            {showCharts && locations.length > 1 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Análisis de Ruta</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gráfico de Velocidad */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Velocidad en el Tiempo</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={locations.slice().reverse().map((loc, idx) => ({
                        index: idx + 1,
                        velocidad: loc.speed ? (parseFloat(loc.speed) * 3.6).toFixed(1) : 0,
                        timestamp: new Date(loc.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                        <YAxis label={{ value: 'km/h', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="velocidad" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gráfico de Altitud */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Altitud en el Tiempo</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={locations.slice().reverse().map((loc, idx) => ({
                        index: idx + 1,
                        altitud: loc.altitude ? parseFloat(loc.altitude).toFixed(0) : 0,
                        timestamp: new Date(loc.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                        <YAxis label={{ value: 'metros', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="altitud" stroke="#3b82f6" fill="#93c5fd" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gráfico de Precisión */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Precisión GPS</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={locations.slice().reverse().map((loc, idx) => ({
                        index: idx + 1,
                        precision: loc.accuracy ? parseFloat(loc.accuracy).toFixed(1) : 0,
                        timestamp: new Date(loc.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                        <YAxis label={{ value: 'metros', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="precision" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Estadísticas */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">📈 Estadísticas</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total de puntos:</span>
                        <span className="font-bold text-purple-600">{locations.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Velocidad promedio:</span>
                        <span className="font-bold text-blue-600">
                          {(locations.reduce((sum, loc) => sum + (loc.speed ? parseFloat(loc.speed) * 3.6 : 0), 0) / locations.length).toFixed(1)} km/h
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Altitud promedio:</span>
                        <span className="font-bold text-green-600">
                          {(locations.reduce((sum, loc) => sum + (loc.altitude ? parseFloat(loc.altitude) : 0), 0) / locations.length).toFixed(0)} m
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Precisión promedio:</span>
                        <span className="font-bold text-orange-600">
                          {(locations.reduce((sum, loc) => sum + (loc.accuracy ? parseFloat(loc.accuracy) : 0), 0) / locations.length).toFixed(1)} m
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de ubicaciones */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Ubicaciones</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {locations.map((location, index) => (
                  <div key={location.id || index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Navigation className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">
                            Lat: {Number(location.latitude).toFixed(6)}, 
                            Lng: {Number(location.longitude).toFixed(6)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(location.timestamp).toLocaleString('es-ES')}
                        </p>
                        {location.accuracy && (
                          <p className="text-xs text-green-600 mt-1">
                            Precisión: {location.accuracy}m
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

