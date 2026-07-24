from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from twilio.twiml.messaging_response import MessagingResponse

from app.database import get_db
from app.models.conversation import Conversation, Message
from app.models.business import Business
from app.services.whatsapp import WhatsAppService
from app.utils.security import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])


@router.post("/webhook/{business_id}")
async def whatsapp_webhook(business_id: int, request: Request, db: Session = Depends(get_db)):
    """
    Webhook para recibir mensajes de WhatsApp via Twilio.
    """
    form_data = await request.form()
    data = dict(form_data)
    
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        return {"error": "Business not found"}
    
    whatsapp = WhatsAppService()
    message_data = whatsapp.receive_message(data)
    
    # Buscar o crear conversacion
    conversation = db.query(Conversation).filter(
        Conversation.business_id == business_id,
        Conversation.customer_phone == message_data["from_number"]
    ).first()
    
    if not conversation:
        conversation = Conversation(
            business_id=business_id,
            customer_phone=message_data["from_number"],
            customer_name=message_data["profile_name"],
            last_message=message_data["body"]
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    # Guardar mensaje del cliente
    customer_message = Message(
        conversation_id=conversation.id,
        sender_type="customer",
        content=message_data["body"]
    )
    db.add(customer_message)
    
    # Obtener historial de mensajes para contexto
    messages = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).order_by(Message.created_at).all()
    
    # Convertir a formato para OpenAI
    message_history = []
    for msg in messages[-10:]:  # Ultimos 10 mensajes
        role = "user" if msg.sender_type == "customer" else "assistant"
        message_history.append({"role": role, "content": msg.content})
    
    # Generar respuesta con IA
    if business.ai_enabled and business.ai_context:
        response_text = whatsapp.generate_ai_response(
            message_history=message_history,
            business_context=business.ai_context
        )
    else:
        response_text = whatsapp.generate_basic_response(message_data["body"])
    
    # Guardar respuesta de la IA
    ai_message = Message(
        conversation_id=conversation.id,
        sender_type="ai",
        content=response_text
    )
    db.add(ai_message)
    
    conversation.last_message = response_text
    db.commit()
    
    # Responder a Twilio
    twiml = MessagingResponse()
    twiml.message(response_text)
    
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(content=str(twiml), media_type="application/xml")


@router.get("/conversations", tags=["Conversaciones"])
async def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    conversations = db.query(Conversation).all()
    return conversations


@router.get("/conversations/{conversation_id}/messages", tags=["Conversaciones"])
async def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).all()
    return messages


@router.post("/send/{business_id}", tags=["Envio manual"])
async def send_message_manual(
    business_id: int,
    to_number: str,
    message: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business or not business.twilio_sid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Business not configured for WhatsApp"
        )
    
    whatsapp = WhatsAppService(business.twilio_sid, business.twilio_auth_token)
    
    result = whatsapp.send_message(
        to_number=f"whatsapp:{to_number}",
        from_number=f"whatsapp:{business.twilio_phone_number}",
        message=message
    )
    
    return result


@router.post("/test-receive", tags=["Test"])
async def test_receive_message(
    business_id: int,
    from_number: str,
    body: str,
    db: Session = Depends(get_db)
):
    """
    Endpoint de prueba para simular mensaje entrante.
    """
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    conversation = db.query(Conversation).filter(
        Conversation.business_id == business_id,
        Conversation.customer_phone == from_number
    ).first()
    
    if not conversation:
        conversation = Conversation(
            business_id=business_id,
            customer_phone=from_number,
            customer_name="Cliente de Prueba",
            last_message=body
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    customer_message = Message(
        conversation_id=conversation.id,
        sender_type="customer",
        content=body
    )
    db.add(customer_message)
    
    # Obtener historial
    messages = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).order_by(Message.created_at).all()
    
    message_history = []
    for msg in messages[-10:]:
        role = "user" if msg.sender_type == "customer" else "assistant"
        message_history.append({"role": role, "content": msg.content})
    
    # Generar respuesta con IA
    whatsapp = WhatsAppService()
    if business.ai_enabled and business.ai_context:
        response_text = whatsapp.generate_ai_response(
            message_history=message_history,
            business_context=business.ai_context
        )
    else:
        response_text = whatsapp.generate_basic_response(body)
    
    ai_message = Message(
        conversation_id=conversation.id,
        sender_type="ai",
        content=response_text
    )
    db.add(ai_message)
    
    conversation.last_message = response_text
    db.commit()
    
    return {
        "conversation_id": conversation.id,
        "customer_message": body,
        "ai_response": response_text,
        "ai_enabled": business.ai_enabled,
        "business_context_used": bool(business.ai_context)
    }