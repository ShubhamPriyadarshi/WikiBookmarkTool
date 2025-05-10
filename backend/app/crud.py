from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, or_
from .models import User, Article, article_saves
from .schemas import TagUpdate, ArticleOut
from .auth import hash_password, verify_password
from .llm import generate_tags
import logging

from .wiki import fetch_article_body_from_wikipedia

logger = logging.getLogger("uvicorn")


async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar()


async def create_user(db: AsyncSession, username: str, password: str):
    user = User(username=username, hashed_password=hash_password(password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(db, username, password):
    user = await get_user_by_username(db, username)
    if user and verify_password(password, user.hashed_password):
        return user
    return None


async def get_article_by_page_id(db: AsyncSession, page_id: int):
    """Get article by external page ID or None if it doesn't exist"""
    result = await db.execute(select(Article).where(Article.page_id == page_id))
    return result.scalar_one_or_none()


async def save_article(db: AsyncSession, user_id: int, title: str, page_id: int, snippet: str):
    """Save an article and associate it with a user"""
    # First check if article already exists by page_id
    existing_article = await get_article_by_page_id(db, page_id)

    if not existing_article:
        # Article doesn't exist, create it
        tags = await generate_tags(title)
        tags = str(tags['text'])
        try:
            body = await fetch_article_body_from_wikipedia(page_id)
        except (RuntimeError, ValueError) as e:
            raise HTTPException(status_code=500, detail=str(e))

        article = Article(  # Track who first created it
            title=title,
            body=body,
            tags=tags,
            page_id=page_id,
            snippet=snippet
        )
        db.add(article)
        await db.commit()
        await db.refresh(article)
    else:
        # Use existing article
        article = existing_article

    # Now associate this article with the user in the many-to-many table
    # First check if user already saved this article
    result = await db.execute(
        select(article_saves).where(
            and_(
                article_saves.c.user_id == user_id,
                article_saves.c.article_id == article.id
            )
        )
    )

    if result.first() is None:
        # User hasn't saved this article yet, create the association
        await db.execute(
            article_saves.insert().values(
                user_id=user_id,
                article_id=article.id
            )
        )
        await db.commit()

    return article


async def unsave_article(db: AsyncSession, user_id: int, article_id: int):
    """Remove the association between a user and an article"""
    await db.execute(
        article_saves.delete().where(
            and_(
                article_saves.c.user_id == user_id,
                article_saves.c.article_id == article_id
            )
        )
    )
    await db.commit()
    return {"status": "success"}


async def get_user_articles(db: AsyncSession, user_id: int):
    """Get all articles saved by a specific user"""
    # Join article_saves and articles to get all saved articles for a user
    result = await db.execute(
        select(Article).join(
            article_saves,
            and_(
                article_saves.c.article_id == Article.id,
                article_saves.c.user_id == user_id
            )
        )
    )
    return result.scalars().all()


async def get_user_article(db: AsyncSession,  page_id: int,user_id: int,):
    """Check if a specific article is saved by a user"""
    result = await db.execute(
        select(Article).join(
            article_saves,
            and_(
                article_saves.c.article_id == Article.id,
                article_saves.c.user_id == user_id
            )
        ).where(Article.page_id == page_id)
    )
    article = result.scalar_one_or_none()
    return article


async def set_tags(db: AsyncSession, tag_update: TagUpdate):
    """Update tags for an article"""
    result = await db.execute(
        select(Article).where(Article.page_id == int(tag_update.pageid))
    )
    article = result.scalar_one_or_none()

    if article:
        article.tags = tag_update.tags
        await db.commit()
        await db.refresh(article)
        return article
    return None


async def delete_article_by_page_id(db: AsyncSession, user_id: int, page_id: int):
    """
    Remove the association between a user and an article using the Wikipedia page_id.
    Returns the article that was unsaved on success.
    Raises HTTPException if article doesn't exist or isn't saved by the user.
    """
    # First find the article by page_id
    article_result = await db.execute(select(Article).where(Article.page_id == page_id))
    article = article_result.scalar_one_or_none()

    if not article:
        raise HTTPException(
            status_code=404,
            detail="Article not found"
        )

    # Check if the user has this article saved
    assoc_result = await db.execute(
        select(article_saves).where(
            and_(
                article_saves.c.article_id == article.id,
                article_saves.c.user_id == user_id
            )
        )
    )

    if assoc_result.first() is None:
        raise HTTPException(
            status_code=404,
            detail="Article not saved by this user"
        )

    # Remove the association
    await db.execute(
        article_saves.delete().where(
            and_(
                article_saves.c.user_id == user_id,
                article_saves.c.article_id == article.id
            )
        )
    )
    await db.commit()

    return {"status": "success", "message": f"Article '{article.title}' removed from saved list",
            "article_id": article.id}