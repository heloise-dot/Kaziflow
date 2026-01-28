# --- ROBUST MONKEYPATCH FOR BCRYPT/PASSLIB COMPATIBILITY ---
import bcrypt
import functools

if not hasattr(bcrypt, "__about__"):
    class About:
        __version__ = getattr(bcrypt, "__version__", "4.0.1")
    bcrypt.__about__ = About()

original_hashpw = bcrypt.hashpw
@functools.wraps(original_hashpw)
def patched_hashpw(password, salt):
    if isinstance(password, str):
        password = password.encode('utf-8')
    if len(password) > 72:
        password = password[:72]
    return original_hashpw(password, salt)

bcrypt.hashpw = patched_hashpw
print("Applied robust bcrypt monkeypatch in main.py")
# -----------------------------------------------------------

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan, title="KaziFlow API", version="1.0.0")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Permissive CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to KaziFlow API"}

from backend.routers import auth, risk, invoices, notifications

app.include_router(auth.router)
app.include_router(risk.router)
app.include_router(invoices.router)
app.include_router(notifications.router)

