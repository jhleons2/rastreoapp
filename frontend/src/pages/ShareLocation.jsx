import { useState, useEffect } from 'react'
import { MapPin, Navigation, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'https://rastreoapp-production.up.railway.app'

export default function ShareLocation() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(true)
  const [device, setDevice] = useState(null)
  const [location, setLocation] = useState(null)
  const [sharing, setSharing] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_URL}/api/share/verify-share-token/${token}`)
      const data = await response.json()
      
      if (data.valid) {
        setDevice(data.device)
        setVerifying(false)
        requestLocation()
      } else {
        toast.error(data.error || 'Link inválido')
        setVerifying(false)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error verifying token:', error)
      toast.error('Error al verificar el link')
      setLoading(false)
    }
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización')
      return
    }

    setLoading(true)
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          heading: position.coords.heading
        })
        setLoading(false)
        toast.success('Ubicación obtenida correctamente')
      },
      (error) => {
        console.error('Geolocation error:', error)
        toast.error('No se pudo obtener tu ubicación. Asegúrate de permitir el acceso a la ubicación.')
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const shareLocation = async () => {
    if (!location) {
      toast.error('Primero obtén tu ubicación')
      return
    }

    setSharing(true)

    try {
      const response = await fetch(`${API_URL}/api/share/share-location/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast.success('Ubicación compartida exitosamente')
      } else {
        toast.error(data.error || 'Error al compartir ubicación')
      }
    } catch (error) {
      console.error('Error sharing location:', error)
      toast.error('Error al compartir ubicación')
    } finally {
      setSharing(false)
    }
  }

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {verifying ? 'Verificando link...' : 'Obteniendo tu ubicación...'}
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Ubicación Compartida!</h1>
          <p className="text-gray-600 mb-6">
            Tu ubicación ha sido compartida exitosamente con el dispositivo <strong>{device?.name}</strong>.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Tu ubicación está segura y solo el dueño del dispositivo puede verla.
              </p>
            </div>
            <button
              onClick={() => window.close()}
              className="w-full btn-primary bg-green-600 hover:bg-green-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Compartir Ubicación</h1>
          <p className="text-gray-600">
            Comparte tu ubicación con: <strong>{device?.name}</strong>
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {location ? (
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Ubicación Obtenida</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>📍 Lat: {Number(location.latitude).toFixed(6)}</p>
                <p>📍 Lng: {Number(location.longitude).toFixed(6)}</p>
                <p>🎯 Precisión: {Number(location.accuracy).toFixed(0)}m</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-900">Esperando Ubicación</span>
              </div>
              <p className="text-sm text-yellow-700">
                Permite el acceso a tu ubicación cuando se solicite.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {!location && (
            <button
              onClick={requestLocation}
              disabled={loading}
              className="w-full btn-primary"
            >
              <Navigation className="w-5 h-5 inline mr-2" />
              {loading ? 'Obteniendo ubicación...' : 'Obtener Mi Ubicación'}
            </button>
          )}
          
          {location && (
            <>
              <button
                onClick={requestLocation}
                className="w-full btn-secondary"
              >
                <Navigation className="w-5 h-5 inline mr-2" />
                Actualizar Ubicación
              </button>
              
              <button
                onClick={shareLocation}
                disabled={sharing}
                className="w-full btn-primary bg-green-600 hover:bg-green-700"
              >
                {sharing ? 'Compartiendo...' : '✓ Compartir Ubicación'}
              </button>
            </>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800 text-center">
            🔒 Tu privacidad está protegida. Esta ubicación solo será visible para el dueño del dispositivo.
          </p>
        </div>
      </div>
    </div>
  )
}

