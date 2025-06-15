from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Vantage API", version="0.1.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # NextJS dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to Vantage API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI backend!"}


if __name__ == "__main__":
    main()
