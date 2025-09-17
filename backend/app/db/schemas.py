
#  We have structured the data from the API for validating and serializing data related to interactions
from pydantic import BaseModel, ConfigDict
from typing import Optional

class InteractionBase(BaseModel):
    hcp_name: Optional[str] = None
    interaction_type: Optional[str] = "Meeting"
    interaction_date: Optional[str] = None
    interaction_time: Optional[str] = None
    attendees: Optional[str] = None
    topics_discussed: Optional[str] = None
    sentiment: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    
    
#hcp_name field is now mandatory 
class InteractionCreate(InteractionBase):
    hcp_name: str

#id field, which is the unique identifier
class Interaction(InteractionBase):
    id: int
    # This is the updated syntax for Pydantic Model So that we can send this to databse 
    model_config = ConfigDict(from_attributes=True)

# We are sending the Current Data to API that we will getting from the user
class ChatRequest(BaseModel):
    message: str
    current_data: InteractionBase