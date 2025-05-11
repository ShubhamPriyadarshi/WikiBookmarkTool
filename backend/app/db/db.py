from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import os
import ssl
from dotenv import load_dotenv
import asyncio
from sqlalchemy.sql import text
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
ssl_context = ssl.create_default_context()
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"ssl": ssl_context}  # Passing SSL config here
)

AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
