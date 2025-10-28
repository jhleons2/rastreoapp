import { useState, useEffect } from 'react'
import { Smartphone, Plus, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'https://rastreoapp-production.up.railway.app'

export default function Devices() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDevice, setEditingDevice] = useState(null)
  const [formData, setFormData] = useState({
    device_name: '',
    device_type: 'mobile'
  })

  useEffect(() => {
    fetchDevices()
  }, [])

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
      }
    } catch (error) {
      console.error('Error fetching devices:', error)
      toast.error('Error al cargar dispositivos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const method = editingDevice ? 'PUT' : 'POST'
      const url = editingDevice 
        ? `${API_URL}/api/devices/${editingDevice}`
        : `${API_URL}/api/devices`

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(editingDevice ? 'Dispositivo actualizado exitosamente' : 'Dispositivo registrado exitosamente')
        setShowModal(false)
        setEditingDevice(null)
        setFormData({ device_name: '', device_type: 'mobile' })
        fetchDevices()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Error al registrar dispositivo')
      }
    } catch (error) {
      toast.error('Error al registrar dispositivo')
    }
  }

  const handleEdit = (device) => {
    setFormData({
      device_name: device.device_name,
      device_type: device.device_type
    })
    setEditingDevice(device.id)
    setShowModal(true)
  }

  const handleDelete = async (deviceId) => {
    if (!confirm('¿Estás seguro de eliminar este dispositivo?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/devices/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Dispositivo eliminado exitosamente')
        fetchDevices()
      } else {
        toast.error('Error al eliminar dispositivo')
      }
    } catch (error) {
      toast.error('Error al eliminar dispositivo')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispositivos</h1>
          <p className="text-gray-600 mt-2">Gestiona tus dispositivos de rastreo</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Registrar Dispositivo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      ) : devices.length === 0 ? (
        <div className="card text-center py-12">
          <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay dispositivos</h3>
          <p className="text-gray-600 mb-4">Registra tu primer dispositivo para comenzar</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Registrar Dispositivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div key={device.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{device.device_name || `Dispositivo ${device.id}`}</h3>
                    <p className="text-sm text-gray-600 capitalize">{device.device_type || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                device.is_active 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {device.is_active ? 'Activo' : 'Inactivo'}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>Última vez: {device.last_seen 
                  ? new Date(device.last_seen).toLocaleString('es-ES')
                  : 'Nunca'
                }</p>
                <p>ID: #{device.id}</p>
                <p className="text-xs text-gray-500">
                  Creado: {new Date(device.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => handleEdit(device)} 
                  className="btn-secondary flex-1 py-2"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(device.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowModal(false)
            setEditingDevice(null)
            setFormData({ device_name: '', device_type: 'mobile' })
          }}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {editingDevice ? 'Editar Dispositivo' : 'Registrar Dispositivo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Dispositivo
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Mi Celular"
                  value={formData.device_name}
                  onChange={(e) => setFormData({ ...formData, device_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  className="input-field"
                  value={formData.device_type}
                  onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                >
                  <option value="mobile">Móvil</option>
                  <option value="tablet">Tablet</option>
                  <option value="watch">Smartwatch</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingDevice(null)
                    setFormData({ device_name: '', device_type: 'mobile' })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingDevice ? 'Actualizar' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

