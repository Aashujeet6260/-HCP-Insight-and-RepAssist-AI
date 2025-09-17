from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.database import engine, Base
from .api.v1.endpoints import interactions

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-First HCP CRM")

# CORS configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware, #  CorsMiddleware to handle Cross-Origin Resource Sharing
    allow_origins=origins, # Authenticated origins
    allow_credentials=True, # Allow cookies and authentication headers
    allow_methods=["*"], # Allow all HTTP methods like GET, POST, etc.
    allow_headers=["*"], # Allow all headers
)

# Include API routers 
app.include_router(interactions.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-First HCP CRM Backend"}