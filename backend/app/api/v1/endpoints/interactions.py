from fastapi import APIRouter
from ....db import schemas
from ....agent.tools import (
    extract_interaction_details,
    save_interaction_to_database,
    edit_existing_interaction,
    schedule_follow_up,
    get_hcp_interaction_history,
)
import re

router = APIRouter(
    prefix="/interactions",
    tags=["interactions"],
)

@router.post("/chat")
def chat_with_agent(request: schemas.ChatRequest):
    user_message = request.message
    user_message_lower = user_message.lower()
    current_form = request.current_data.dict()
    ai_response = "I've updated the form with that information. What's next?"
    
    # --- ROUTER LOGIC ---
    # This is more reliable than letting the LLM decide every time.
    
    # Keyword for SAVING
    if any(word in user_message_lower for word in ["save", "log it", "submit", "confirm"]):
        data_to_save = {k: v for k, v in current_form.items() if v is not None}
        ai_response = save_interaction_to_database.invoke({"interaction_data": data_to_save})
    
    # Keyword for SCHEDULING
    elif any(word in user_message_lower for word in ["remind", "schedule", "follow up"]):
        ai_response = schedule_follow_up.invoke({"task_description": request.message})
    
    # Keyword for HISTORY
    elif "history" in user_message_lower:
        name_match = re.search(r"history for (.+)", user_message_lower)
        if name_match:
            hcp_name = name_match.group(1).strip()
            ai_response = get_hcp_interaction_history.invoke({"hcp_name": hcp_name})
        else:
            ai_response = "Who's history would you like me to get?"
            
    # DEFAULT ACTION: Extract data and update the form
    else:
        updates = extract_interaction_details.invoke({"user_text": request.message})
        if updates:
            current_form.update(updates)
        else:
            ai_response = "I'm sorry, I didn't find any specific details to update in that message. Could you be more specific?"

    return {
        "ai_response": ai_response,
        "updated_form_data": schemas.InteractionBase(**current_form)
    }