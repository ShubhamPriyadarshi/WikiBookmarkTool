from fastapi import FastAPI, Depends, HTTPException, Path
from .db import get_db
from . import wiki, crud
from .models import Article, article_saves
from .schemas import UserCreate, ArticleCreate, ArticleOut,TagUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .auth import create_access_token, decode_token
from fastapi import Header
from fastapi.responses import JSONResponse
import requests
import logging

from .wiki import fetch_article_body_from_wikipedia

logger = logging.getLogger("uvicorn")
app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@app.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(400, "Username already exists")
    return await crud.create_user(db, user.username, user.password)

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"sub": user.username, "id": user.id})
    return {"access_token": token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return await crud.get_user_by_username(db, payload["sub"])

async def get_current_user_id(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["id"]


@app.get("/search")
async def search(query: str):
    return await wiki.search_wikipedia(query)

@app.post("/save")
async def save(article: ArticleCreate, db: AsyncSession = Depends(get_db), user_id=Depends(get_current_user_id)): #user_id: int = 1070685144025825281):
    return await crud.save_article(db, user_id, article.title,article.page_id,article.snippet)

@app.get("/saved")
async def articles(db: AsyncSession = Depends(get_db), user_id=Depends(get_current_user_id)): #user_id: int = 1070685144025825281):
    return await crud.get_user_articles(db, user_id)

@app.get("/saved/page/{pageid}")
async def get_saved_article(pageid: int, db: AsyncSession = Depends(get_db),user_id=Depends(get_current_user_id)):
    result = await crud.get_user_article(db,pageid,user_id )
    # logger.info(body)
    return {"content": result.body, "tags": result.tags, "title": result.title}

@app.get("/article/{pageid}")
async def get_article_detail(pageid: int):
    try:
        body = await fetch_article_body_from_wikipedia(pageid)
    except (RuntimeError, ValueError) as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"content": body}

@app.post("/set-tags")
async def update_tags(tag_data: TagUpdate, db: AsyncSession = Depends(get_db)):
    updated_article = await crud.set_tags(db, tag_data)

@app.get("/verify-token")
async def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_token(token)
        # logger.info(payload)
        if not payload:
            # logger.info("Payload Empty")
            return {"valid": False}

        return {"valid": True}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.delete("/saved/page/{page_id}")
async def delete_saved_article_by_pageid(
    page_id: int = Path(..., title="The Wikipedia page ID of the article to unsave"),
    db: AsyncSession = Depends(get_db),
    user_id = Depends(get_current_user_id)
):
    """
    Remove an article from a user's saved list using the Wikipedia page_id.
    """
    return await crud.delete_article_by_page_id(db, user_id, page_id)