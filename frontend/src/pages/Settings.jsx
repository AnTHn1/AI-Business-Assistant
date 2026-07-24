import { useState, useEffect } from 'react';
import api from '../services/api';
import { Save, Bot, MessageSquare, Clock, MapPin, Phone } from 'lucide-react';

export default function Settings() {
  const [config, setConfig] = useState({
    name: '',
    welcome_message: '',
    ai_context: '',
    ai_enabled: true,
    whatsapp_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await api.get('/whatsapp/conversations');
      // Por ahora usamos datos de ejemplo, luego vendrán de /business/me
      setConfig({
        name: 'Clinica Dental Demo',
        welcome_message: '¡Bienvenido a nuestra clinica! ¿En que podemos ayudarte?',
        ai_context: `Somos una clinica dental en Lima, Peru.

SERVICIOS Y PRECIOS:
- Limpieza dental: S/80
- Blanqueamiento: S/350
- Brackets (ortodoncia): S/2500
- Extraccion: S/150
- Revision general: S/50

HORARIO:
- Lunes a Viernes: 9:00 AM - 6:00 PM
- Sabados: 9:00 AM - 1:00 PM

UBICACION:
Av. Javier Prado 1234, San Isidro, Lima

CONTACTO:
- Telefono: (01) 234-5678
- Emergencias: 999-888-777

POLITICAS:
- Citas con 24h de anticipacion
- Cancelaciones gratis hasta 2h antes
- Aceptamos tarjeta y efectivo`,
        ai_enabled: true,
        whatsapp_number: '+51999999999',
      });
    } catch (error) {
      console.error('Error cargando configuracion:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    // Aqui iria la llamada a la API para guardar
    // await api.put('/business/1', config);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuracion del Negocio</h1>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          Configuracion guardada correctamente
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Informacion basica */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
            Informacion Basica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({...config, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero de WhatsApp</label>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={config.whatsapp_number}
                  onChange={(e) => setConfig({...config, whatsapp_number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
            Mensaje de Bienvenida
          </h2>
          <textarea
            value={config.welcome_message}
            onChange={(e) => setConfig({...config, welcome_message: e.target.value})}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Configuracion de IA */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Bot className="w-5 h-5 mr-2 text-purple-600" />
            Inteligencia Artificial
          </h2>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={config.ai_enabled}
              onChange={(e) => setConfig({...config, ai_enabled: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Activar respuestas automaticas con IA
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contexto del Negocio (la IA usara esta informacion para responder)
            </label>
            <textarea
              value={config.ai_context}
              onChange={(e) => setConfig({...config, ai_context: e.target.value})}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Incluye precios, horarios, servicios, ubicacion y politicas. La IA usara esta informacion para responder a los clientes.
            </p>
          </div>
        </div>

        {/* Boton guardar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Configuracion'}
          </button>
        </div>
      </div>
    </div>
  );
}