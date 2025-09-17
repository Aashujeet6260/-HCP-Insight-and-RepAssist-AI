from langchain_core.tools import tool
from pydantic import BaseModel, Field
from ..db import models
from sqlalchemy.orm import Session
from typing import Optional, Dict
from ..core.config import GROQ_API_KEY
from langchain_groq import ChatGroq
from datetime import date

def _get_db_session():
    """Helper function to create a new database session."""
    from ..db.database import SessionLocal
    return SessionLocal()

class InteractionDataSchema(BaseModel):
    """The schema for all data fields related to an HCP interaction."""
    hcp_name: Optional[str] = Field(None, description="The name of the healthcare professional.")
    interaction_type: Optional[str] = Field(None, description="The type of interaction, e.g., 'Meeting', 'Call', 'Email'.")
    interaction_date: Optional[str] = Field(None, description="The date of the interaction.")
    interaction_time: Optional[str] = Field(None, description="The time of the interaction.")
    attendees: Optional[str] = Field(None, description="Names of others who were present.")
    sentiment: Optional[str] = Field(None, description="The sentiment: 'Positive', 'Neutral', or 'Negative'.")
    topics_discussed: Optional[str] = Field(None, description="A summary of topics discussed.")
    outcomes: Optional[str] = Field(None, description="A summary of key outcomes or agreements.")
    follow_up_actions: Optional[str] = Field(None, description="A summary of next steps or follow-up actions.")

@tool
def extract_interaction_details(user_text: str) -> dict:
    """
    This is the primary tool. It takes the user's raw text, extracts any
    details that match the form fields, and returns them as a dictionary to update the UI.
    """
    print(f"--- EXTRACTING DETAILS from: '{user_text}' ---")
    
    extractor_llm = ChatGroq(
        model="gemma2-9b-it",
        groq_api_key=GROQ_API_KEY,
        temperature=0
    ).with_structured_output(InteractionDataSchema)

    # UPDATED PROMPT: Added more specific instructions and today's date for context.
    current_date = date.today().strftime("%Y-%m-%d")
    prompt = f"""
    You are an expert data extraction assistant. Your job is to extract information from the user's message.
    The user is trying to fill a form with the following fields:
    - hcp_name, interaction_type, interaction_date, interaction_time, attendees, sentiment, topics_discussed, outcomes, follow_up_actions

    Parse the following user message and extract any values that correspond to these fields.
    If the user says 'today', infer the current date, which is {current_date}.
    If the user mentions a positive sentiment (e.g., "great meeting", "went well"), set sentiment to 'Positive'.
    If the user mentions a negative sentiment (e.g., "difficult", "concerns"), set sentiment to 'Negative'.

    User's message: '{user_text}'
    """
    
    try:
        extracted_model = extractor_llm.invoke(prompt)
        update_dict = extracted_model.model_dump(exclude_unset=True)
        print(f"--- Extracted: {update_dict} ---")
        return update_dict
    except Exception as e:
        print(f"--- Extraction Error: {e} ---")
        return {}

@tool
def save_interaction_to_database(interaction_data: Dict) -> str:
    """(Log Interaction) Use this tool ONLY when the user asks to SAVE the interaction."""
    print(f"--- SAVING INTERACTION: {interaction_data} ---")
    db: Session = _get_db_session()
    try:
        if not interaction_data.get("hcp_name"):
            return "Error: Cannot save. The HCP Name is a required field."
        db_interaction = models.Interaction(**interaction_data)
        db.add(db_interaction)
        db.commit()
        db.refresh(db_interaction)
        db.close()
        return f"Success! The interaction with {interaction_data.get('hcp_name')} has been saved. The new ID is {db_interaction.id}."
    except Exception as e:
        db.close()
        return f"Error: Could not save to the database. Details: {e}"

@tool
def edit_existing_interaction(interaction_id: int, updates: Dict[str, str]) -> str:
    """(Edit Interaction) Use to MODIFY an EXISTING record by its ID."""
    db: Session = _get_db_session()
    interaction = db.query(models.Interaction).filter(models.Interaction.id == interaction_id).first()
    if not interaction:
        return f"Error: Interaction ID {interaction_id} not found."
    for key, value in updates.items():
        if hasattr(interaction, key):
            setattr(interaction, key, value)
    db.commit()
    db.close()
    return f"Successfully updated interaction ID {interaction_id}."

@tool
def schedule_follow_up(task_description: str, due_date: str = "next week") -> str:
    """Use to schedule a follow-up task or reminder."""
    return f"Okay, I've scheduled a reminder for you: '{task_description}' due {due_date}."

@tool
def get_hcp_interaction_history(hcp_name: str) -> str:
    """Use to retrieve the summary of past interactions with a specific HCP."""
    db: Session = _get_db_session()
    interactions = db.query(models.Interaction).filter(models.Interaction.hcp_name.ilike(f"%{hcp_name}%")).all()
    db.close()
    if not interactions:
        return f"No interaction history found for {hcp_name}."
    summary = f"History for {hcp_name}:\n"
    for i in interactions:
        summary += f"- ID {i.id} on {i.interaction_date}: Discussed '{i.topics_discussed}'.\n"
    return summary

all_tools = [
    extract_interaction_details,
    save_interaction_to_database,
    edit_existing_interaction,
    schedule_follow_up,
    get_hcp_interaction_history
]