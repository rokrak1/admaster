from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routers import protected_router, public_router
import app.routes.routes_init


app = FastAPI()

origins = [
    "http://localhost:3000",  # Adjust to your frontend's URL
]

# Add middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
    expose_headers=["Authorization"]
)

app.include_router(public_router, prefix="/api")
app.include_router(protected_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)