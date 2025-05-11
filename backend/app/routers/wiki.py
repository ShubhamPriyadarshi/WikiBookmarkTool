from fastapi import APIRouter, HTTPException
from ..util.wiki import fetch_article_body_from_wikipedia,search_wikipedia


router = APIRouter()

@router.get("/article/{pageid}")
async def get_article_detail(pageid: int):
    try:
        body = await fetch_article_body_from_wikipedia(pageid)
    except (RuntimeError, ValueError) as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"content": body}

@router.get("/search")
async def search(query: str):
    return await search_wikipedia(query)