from fastapi import FastAPI
# Make sure your agent/tools can be imported from here
# You might need to adjust Python's path or restructure your agent code

app = FastAPI()

@app.post("/api/chat") # The path now includes /api/
def chat_with_agent(request: ChatRequest):
    # Your rule-based router or LangGraph logic goes here
    # Note: This is now a standard HTTP endpoint, not a WebSocket
    ...
    return {"ai_response": "...", "updated_form_data": ...}

# A root endpoint for testing
@app.get("/api")
def handle_root():
    return {"message": "Backend is running"}