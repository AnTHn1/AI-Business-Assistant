import { useEffect, useState } from 'react';
import { whatsappAPI } from '../services/api';
import { MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeConversations: 0,
    totalMessages: 0,
    todayConversations: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await whatsappAPI.getConversations();
      const conversations = response.data;
      setStats({
        totalConversations: conversations.length,
        activeConversations: conversations.filter(c => c.is_open).length,
        totalMessages: conversations.reduce((acc, c) => acc + (c.messages?.length || 0), 0),
        todayConversations: conversations.filter(c => {
          const today = new Date().toISOString().split('T')[0];
          return c.created_at?.startsWith(today);
        }).length
      });
    } catch (error) {
      console.error('Error cargando estadisticas:', error);
    }
  };

  const cards = [
    { title: 'Conversaciones Totales', value: stats.totalConversations, icon: MessageSquare, color: 'bg-blue-500' },
    { title: 'Conversaciones Activas', value: stats.activeConversations, icon: Users, color: 'bg-green-500' },
    { title: 'Mensajes Totales', value: stats.totalMessages, icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Hoy', value: stats.todayConversations, icon: Clock, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}