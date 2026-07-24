import google.generativeai as genai
from app.config import settings


class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = None
        self.error = None
        
        if not self.api_key:
            self.error = "No hay API key configurada"
            print(f"Error Gemini init: {self.error}")
            return
            
        try:
            genai.configure(api_key=self.api_key)
            # Usar modelo disponible para nuevos usuarios
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            print("✅ Modelo Gemini cargado correctamente: gemini-2.0-flash")
        except Exception as e:
            self.error = str(e)
            print(f"❌ Error cargando modelo Gemini: {e}")

    def generate_response(self, message_history: list, business_context: str = "") -> str:
        if not self.model:
            return f"Error IA: {self.error or 'Modelo no inicializado'}"
        
        try:
            system_prompt = f"""Eres un asistente virtual profesional de un negocio. 
            
Contexto del negocio:
{business_context if business_context else "Atiendes clientes por WhatsApp de forma amable y profesional."}

Reglas:
- Responde de forma natural y conversacional
- Sé conciso (máximo 2-3 oraciones por mensaje)
- Si no sabes algo, pide disculpas y ofrece pasar la conversación a un humano
- Nunca inventes precios ni información que no tengas
- Usa emojis ocasionalmente para ser amigable
- Saluda solo en el primer mensaje
- Si el cliente quiere agendar una cita, pide fecha y hora preferida
- Si pregunta por precios, da la información disponible o pide que consulte directamente"""

            conversation_text = ""
            for msg in message_history:
                role = "Cliente" if msg["role"] == "user" else "Asistente"
                conversation_text += f"{role}: {msg['content']}\n"
            
            prompt = f"""{system_prompt}

Conversación actual:
{conversation_text}

Responde como el asistente del negocio:"""

            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            print(f"❌ Error Gemini generate: {e}")
            return "Lo siento, hubo un problema al generar la respuesta. ¿Puedes reformular tu pregunta?"


gemini_service = GeminiService()