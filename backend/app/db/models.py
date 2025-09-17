
# We will Creating the Structure for the DB Model for storing data related to interactions with Healthcare Professionals (HCPs).

from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from .database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String, index=True, nullable=False)
    interaction_type = Column(String, default="Meeting")
    interaction_date = Column(String)
    interaction_time = Column(String)
    attendees = Column(Text, nullable=True)
    topics_discussed = Column(Text, nullable=True)
    sentiment = Column(String, nullable=True)
    outcomes = Column(Text, nullable=True)
    follow_up_actions = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())