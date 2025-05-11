from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.schemas.article import ArticleCreate,TagUpdate
from ..crud.article import (
    save_article,
    get_user_articles,
    get_user_article,
    delete_article_by_page_id,
    set_tags
)
from ..deps.user import get_current_user_id
from ..db.db import get_db

router = APIRouter()

@router.post("/")
async def save(article: ArticleCreate, db: AsyncSession = Depends(get_db), user_id=Depends(get_current_user_id)): #user_id: int = 1070685144025825281):
    return await save_article(db, user_id, article.title,article.page_id,article.snippet)

@router.get("/")
async def articles(db: AsyncSession = Depends(get_db), user_id=Depends(get_current_user_id)): #user_id: int = 1070685144025825281):
    return await get_user_articles(db, user_id)

@router.get("/article/{pageid}")
async def get_saved_article(pageid: int, db: AsyncSession = Depends(get_db),user_id=Depends(get_current_user_id)):
    result = await get_user_article(db,pageid,user_id )
    # logger.info(body)
    return {"content": result.body, "tags": result.tags, "title": result.title}

@router.delete("/article/{page_id}")
async def delete_saved_article_by_pageid(
    page_id: int,
    db: AsyncSession = Depends(get_db),
    user_id = Depends(get_current_user_id)
):
    """
    Remove an article from a user's saved list using the Wikipedia page_id.
    """
    return await delete_article_by_page_id(db, user_id, page_id)

@router.post("/article/set-tags")
async def update_tags(tag_data: TagUpdate, db: AsyncSession = Depends(get_db)):
    updated_article = await set_tags(db, tag_data)