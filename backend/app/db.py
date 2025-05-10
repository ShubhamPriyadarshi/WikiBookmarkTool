from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import sessionmaker
import os
import ssl
from dotenv import load_dotenv
import asyncio
from sqlalchemy.sql import text
from sqlalchemy.future import select
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
ssl_context = ssl.create_default_context()
# engine = create_async_engine(DATABASE_URL, echo=True)
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"ssl": ssl_context}  # Passing SSL config here
)

AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session



async def test_db_connection():
    async with AsyncSessionLocal() as session:
        # Run a simple query that avoids custom types like json
        result = await session.execute(text("SELECT '1'"))
        print("Database connection test result:", result.scalar())

async def main():
    await test_db_connection()

if __name__ == "__main__":
    asyncio.run(main())
