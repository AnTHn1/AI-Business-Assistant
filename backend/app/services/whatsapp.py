from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse

from app.config import settings
from app.services.gemini import gemini_service


class WhatsAppService:
    def __init__(self, account_sid: str = None, auth_token: str = None):
        self.account_sid = account_sid
        self.auth_token = auth_token
        self.client = None
        
        if account_sid and auth_token:
            self.client = Client(account_sid, auth_token)

    def send_message(self, to_number: str, from_number: str, message: str) -> dict:
        """
        Envía un mensaje de WhatsApp.
        """
        if not self.client:
            raise ValueError("Twilio client not configured")
        
        try:
            msg = self.client.messages.create(
                body=message,
                from_=from_number,
                to=to_number
            )
            return {
                "success": True,
                "message_sid": msg.sid,
                "status": msg.status
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def receive_message(self, request_data: dict) -> dict:
        """
        Procesa un mensaje entrante de WhatsApp.
        """
        return {
            "from_number": request_data.get("From", "").replace("whatsapp:", ""),
            "to_number": request_data.get("To", "").replace("whatsapp:", ""),
            "body": request_data.get("Body", ""),
            "message_sid": request_data.get("MessageSid", ""),
            "profile_name": request_data.get("ProfileName", "Cliente")
        }

    def generate_ai_response(self, message_history: list, business_context: str = "") -> str:
        """
        Genera una respuesta inteligente usando Gemini.
        """
        # Convertir formato de OpenAI a Gemini
        gemini_history = []
        for msg in message_history:
            role = "user" if msg["role"] == "user" else "model"
            gemini_history.append({"role": role, "content": msg["content"]})
        
        return gemini_service.generate_response(gemini_history, business_context)

    def generate_basic_response(self, message_body: str) -> str:
        """
        Respuesta básica por palabras clave (fallback).
        """
        message_lower = message_body.lower()
        
        if any(word in message_lower for word in ["hola", "buenos", "buenas"]):
            return "¡Hola! 👋 Bienvenido a nuestro negocio. ¿En qué puedo ayudarte?"
        elif any(word in message_lower for word in ["precio", "costo", "cuanto", "cuesta"]):
            return "Para darte información de precios, ¿podrías indicarme qué servicio te interesa?"
        elif any(word in message_lower for word in ["cita", "agendar", "reservar", "hora"]):
            return "Con gusto te ayudo a agendar una cita. ¿Qué día y hora te funciona mejor?"
        elif any(word in message_lower for word in ["ubicacion", "direccion", "donde", "estan"]):
            return "Nos encontramos en [Tu dirección]. ¿Te gustaría que te envíe la ubicación?"
        elif any(word in message_lower for word in ["catalogo", "productos", "servicios"]):
            return "Te envío nuestro catálogo: [URL]. ¿Hay algo específico que te interese?"
        elif any(word in message_lower for word in ["gracias", "thank"]):
            return "¡De nada! 😊 Estoy aquí para lo que necesites."
        else:
            return "Entiendo. Déjame consultar con el equipo y te respondo en breve. ¿Es urgente?"