from fastapi import FastAPI, Depends, HTTPException, Path
from ..db.db import get_db
from ..crud import user
from ..db.models import Article, article_saves
from ..db.schemas.user import UserCreate
from ..db.schemas.article import  ArticleCreate, ArticleOut,TagUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from ..util.auth import create_access_token, decode_token
from fastapi import Header
from fastapi.responses import JSONResponse
import requests
import logging

from ..util.wiki import fetch_article_body_from_wikipedia
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return await user.get_user_by_username(db, payload["sub"])

async def get_current_user_id(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["id"]