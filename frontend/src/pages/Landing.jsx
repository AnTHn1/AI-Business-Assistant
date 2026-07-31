import { Link } from 'react-router-dom';
import { MessageSquare, Bot, BarChart3, Shield, Zap, Clock } from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: Bot,
      title: 'IA Inteligente',
      desc: 'Responde automaticamente preguntas frecuentes, precios y horarios.'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp Integrado',
      desc: 'Conecta tu numero de WhatsApp Business y atiende 24/7.'
    },
    {
      icon: BarChart3,
      title: 'Estadisticas',
      desc: 'Visualiza conversaciones, leads y conversiones en tiempo real.'
    },
    {
      icon: Shield,
      title: 'Seguro y Privado',
      desc: 'Tus datos y los de tus clientes estan protegidos.'
    },
    {
      icon: Zap,
      title: 'Configuracion Rapida',
      desc: 'Activa tu asistente en menos de 5 minutos.'
    },
    {
      icon: Clock,
      title: 'Siempre Disponible',
      desc: 'Nunca pierdas un cliente por no responder a tiempo.'
    }
  ];

  const plans = [
    {
      name: 'Basico',
      price: '49',
      features: ['1 numero de WhatsApp', '500 mensajes/mes', 'Respuestas basicas', 'Panel web']
    },
    {
      name: 'Profesional',
      price: '99',
      popular: true,
      features: ['3 numeros de WhatsApp', 'Mensajes ilimitados', 'IA avanzada', 'Panel web', 'Soporte prioritario']
    },
    {
      name: 'Empresarial',
      price: '199',
      features: ['Numeros ilimitados', 'Mensajes ilimitados', 'IA personalizada', 'Panel web', 'API access', 'Soporte 24/7']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Tu Asistente de WhatsApp con IA
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Atiende clientes automaticamente, agenda citas y responde preguntas 
            mientras tu te enfocas en hacer crecer tu negocio.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Probar Gratis
            </Link>
            <a
              href="#precios"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
            >
              Ver Precios
            </a>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">¿Que hace AI Business Assistant?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 border rounded-lg hover:shadow-lg transition">
                <f.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Planes y Precios</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`p-8 rounded-lg ${plan.popular ? 'bg-blue-600 text-white scale-105' : 'bg-white'}`}>
                {plan.popular && (
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    Mas Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mt-4">{plan.name}</h3>
                <div className="my-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className={`${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>/mes</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center">
                      <span className="mr-2">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`block text-center py-3 rounded-lg font-semibold ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Empezar Ahora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para automatizar tu atencion al cliente?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Unete a cientos de negocios que ya usan AI Business Assistant para 
            atender a sus clientes 24/7.
          </p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700"
          >
            Crear Cuenta Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p> 2025 AI Business Assistant. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}