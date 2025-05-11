import httpx

async def search_wikipedia(query: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get("https://en.wikipedia.org/w/api.php", params={
            'action': 'query',
            'list': 'search',
            'srsearch': query,
            'format': 'json'
        })
        return resp.json()['query']['search']

import requests
from fastapi.responses import JSONResponse

async def fetch_article_body_from_wikipedia(pageid: int) -> str:
    wikipedia_url = "https://en.wikipedia.org/w/api.php"

    params = {
        "action": "parse",
        "pageid": pageid,
        "format": "json",
        "origin": "*"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(wikipedia_url, params=params)

    if response.status_code != 200:
        raise RuntimeError("Failed to fetch article")

    data = response.json()
    if "parse" not in data or "text" not in data["parse"]:
        raise ValueError("Article content not found")

    return data["parse"]["text"]["*"]
