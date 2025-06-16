from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.models import (
    User, ApiResponse, HealthCheck,
    LoginRequest, AuthToken,
    Project, ProjectCreate, ProjectList
)

app = FastAPI(
    title="Vantage API", 
    version="0.1.0",
    description="Vantage monorepo API with organized endpoints"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # NextJS dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=ApiResponse, tags=["system"])
async def root():
    return ApiResponse(message="Welcome to Vantage API")


@app.get("/health", response_model=HealthCheck, tags=["system"])
async def health_check():
    return HealthCheck(status="healthy", timestamp=datetime.now())


@app.get("/api/hello", response_model=ApiResponse, tags=["system"])
async def hello():
    return ApiResponse(message="Hello from FastAPI backend!")


@app.get("/api/users/me", response_model=User, tags=["users"])
async def get_current_user():
    # Mock user data
    return User(
        id="user-123",
        email="user@example.com", 
        name="John Doe",
        created_at=datetime.now()
    )


# Auth endpoints
@app.post("/api/auth/login", response_model=AuthToken, tags=["auth"])
async def login(login_data: LoginRequest):
    # Mock authentication
    return AuthToken(
        access_token="mock-jwt-token",
        expires_in=3600
    )


@app.post("/api/auth/logout", response_model=ApiResponse, tags=["auth"])
async def logout():
    return ApiResponse(message="Successfully logged out")


# Project endpoints
@app.get("/api/projects", response_model=ProjectList, tags=["projects"])
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


@app.post("/api/projects", response_model=Project, tags=["projects"])
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
    main()
