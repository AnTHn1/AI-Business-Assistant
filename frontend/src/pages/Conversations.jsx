import { useEffect, useState } from 'react';
import { whatsappAPI } from '../services/api';
import { MessageCircle, User } from 'lucide-react';

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await whatsappAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await whatsappAPI.getMessages(conversationId);
      setMessages(response.data);
      setSelectedConversation(conversationId);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)]">
      <div className="w-1/3 bg-white rounded-lg shadow-md mr-4 overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Conversaciones</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => loadMessages(conv.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{conv.customer_name || conv.customer_phone}</p>
                  <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
                </div>
                {conv.is_open && (
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Chat</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === 'customer' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender_type === 'customer'
                        ? 'bg-gray-100 text-gray-800'
                        : msg.sender_type === 'ai'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    <p className="text-xs font-medium mb-1">
                      {msg.sender_type === 'customer' ? 'Cliente' : msg.sender_type === 'ai' ? 'IA' : 'Humano'}
                    </p>
                    <p>{msg.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-2" />
              <p>Selecciona una conversacion para ver los mensajes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}