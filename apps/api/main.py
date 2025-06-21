from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List
from pydantic import BaseModel

# Import from our restructured modules
from app.core.config import settings

# Temporary Pydantic schemas (will be moved to app/schemas later)
class ApiResponse(BaseModel):
    message: str

class HealthCheck(BaseModel):
    status: str
    timestamp: datetime

class User(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthToken(BaseModel):
    access_token: str
    expires_in: int

class Project(BaseModel):
    id: str
    name: str
    description: str
    owner_id: str
    created_at: datetime

class ProjectCreate(BaseModel):
    name: str
    description: str

class ProjectList(BaseModel):
    projects: List[Project]
    total: int

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS using settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=ApiResponse, tags=["system"], operation_id="getRoot")
async def root():
    return ApiResponse(message="Welcome to Vantage API")


@app.get("/health", response_model=HealthCheck, tags=["system"], operation_id="getHealthCheck")
async def health_check():
    return HealthCheck(status="healthy", timestamp=datetime.now())


@app.get("/api/hello", response_model=ApiResponse, tags=["system"], operation_id="getHello")
async def hello():
    return ApiResponse(message="Hello from FastAPI backend!")


@app.get("/api/users/me", response_model=User, tags=["users"], operation_id="getCurrentUser")
async def get_current_user():
    # Mock user data
    return User(
        id="user-123",
        email="user@example.com", 
        name="John Doe",
        created_at=datetime.now()
    )


# Auth endpoints
@app.post("/api/auth/login", response_model=AuthToken, tags=["auth"], operation_id="login")
async def login(login_data: LoginRequest):
    # Mock authentication
    return AuthToken(
        access_token="mock-jwt-token",
        expires_in=3600
    )


@app.post("/api/auth/logout", response_model=ApiResponse, tags=["auth"], operation_id="logout")
async def logout():
    return ApiResponse(message="Successfully logged out")


# Project endpoints
@app.get("/api/projects", response_model=ProjectList, tags=["projects"], operation_id="getProjects")
async def get_projects():
    # Mock projects
    mock_projects = [
        Project(
            id="proj-1",
            name="My First Project",
            description="A sample project",
            owner_id="user-123",
            created_at=datetime.now()
        )
    ]
    return ProjectList(projects=mock_projects, total=1)


@app.post("/api/projects", response_model=Project, tags=["projects"], operation_id="createProject")
async def create_project(project_data: ProjectCreate):
    # Mock project creation
    return Project(
        id="proj-new",
        name=project_data.name,
        description=project_data.description,
        owner_id="user-123",
        created_at=datetime.now()
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
