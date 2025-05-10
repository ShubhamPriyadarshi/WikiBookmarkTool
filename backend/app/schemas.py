from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class ArticleCreate(BaseModel):
    title: str
    body: Optional[str] = ""
    # url: str
    tags: Optional[str] = ""
    page_id: int
    snippet: str

class ArticleOut(BaseModel):
    page_id: int
    title: str
    tags: str
    body: str

class TagUpdate(BaseModel):
    pageid: str
    tags: str
