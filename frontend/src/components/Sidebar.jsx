import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/conversations', icon: MessageSquare, label: 'Conversaciones' },
    { path: '/settings', icon: Settings, label: 'Configuracion' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">AI Business</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
        <button
          onClick={logout}
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 w-full"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesion
        </button>
      </nav>
    </aside>
  );
}