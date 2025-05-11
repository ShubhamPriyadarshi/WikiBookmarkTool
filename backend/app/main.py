from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from .routers import auth, wiki, saved

logger = logging.getLogger("uvicorn")
app = FastAPI(title="Wikipedia Saver App")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(wiki.router, prefix="/wiki", tags=["wiki"])
app.include_router(saved.router, prefix="/saved", tags=["saved"])