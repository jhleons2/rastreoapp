import { useState, useEffect } from 'react'
import { MapPin, Smartphone, Calendar, Navigation } from 'lucide-react'
import toast from 'react-hot-toast'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'

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

  useEffect(() => {
    fetchDevices()
  }, [])

  useEffect(() => {
    if (selectedDevice) {
      fetchLocations(selectedDevice)
    }
  }, [selectedDevice])

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

  const fetchLocations = async (deviceId) => {
    setLoadingLocations(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/locations/device/${deviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setLocations(data)
      } else {
        toast.error('Error al cargar ubicaciones')
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
      toast.error('Error al cargar ubicaciones')
    } finally {
      setLoadingLocations(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ubicaciones</h1>
        <p className="text-gray-600 mt-2">Visualiza el historial de ubicaciones</p>
      </div>

      {/* Selector de Dispositivo */}
      <div className="card mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Selecciona un dispositivo
        </label>
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

