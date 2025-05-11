from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from ..db.schemas.user import UserCreate
from ..crud.user import get_user_by_username,authenticate_user
from ..db.db import get_db
from ..util.auth import create_access_token, decode_token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(400, "Username already exists")
    return await user.create_user(db, user.username, user.password)

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"sub": user.username, "id": user.id})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/verify-token")
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

