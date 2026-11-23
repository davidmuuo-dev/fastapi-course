from datetime import timedelta
from typing import Annotated

import models
import sqlalchemy.orm
from auth import (
    create_access_token,
    currentUser,
    hash_password,
    verify_password,
)
from config import settings
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from schemas import PostResponse, Token, UserCreate, UserPrivate, UserPublic, UserUpdate
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


# --------------------------
# User creation endpoint
# --------------------------
@router.post("", response_model=UserPrivate, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Annotated[AsyncSession, Depends(get_db)]):
    username_result = await db.execute(
        select(models.User).where(
            func.lower(models.User.username) == user.username.lower()
        )
    )
    existing_user = username_result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists"
        )

    email_result = await db.execute(
        select(models.User).where(func.lower(models.User.email) == user.email.lower())
    )
    existing_email = email_result.scalars().first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists"
        )

    new_user = models.User(
        username=user.username,
        email=user.email.lower(),
        password_hash=hash_password(user.password),
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


# --------------------------------
# Getting  all users endpoint
# -------------------------------
@router.get("", response_model=list[UserPublic])
async def get_all_user(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.User))
    users = result.scalars().all()
    return users


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(models.User).where(
            func.lower(models.User.email) == form_data.username.lower()
        )
    )
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserPrivate)
async def get_current_user(current_user: currentUser):

    return current_user


# --------------------------------------
# Getting single User  endpoint
# ---------------------------------------
@router.get("/{user_id}", response_model=UserPublic)
async def get_user_post(user_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if user:
        return user

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found")


# --------------------------------
# Getting user posts endpoint
# -------------------------------
@router.get("/{user_id}/posts", response_model=list[PostResponse])
async def get_user_posts(user_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    user = await db.execute(select(models.User).where(models.User.id == user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    result = await db.execute(
        select(models.Post)
        .options(sqlalchemy.orm.selectinload(models.Post.author))
        .where(models.Post.user_id == user_id)
        .order_by(models.Post.date_posted.desc())
    )
    posts = result.scalars().all()
    return posts


# --------------------------------
# User Update endpoint
# -------------------------------
@router.patch("/{user_id}", response_model=UserPrivate)
async def user_update(
    user_id: int, update_data: UserUpdate,current_user:currentUser, db: Annotated[AsyncSession, Depends(get_db)]
):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if update_data.username is not None and update_data.username != user.username:
        result = await db.execute(
            select(models.User).where(
                func.lower(models.User.username) == update_data.username.lower()
            )
        )
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists",
            )

    if update_data.email is not None and update_data.email != user.email:
        result = await db.execute(
            select(models.User).where(
                func.lower(models.User.email) == update_data.email.lower()
            )
        )
        existing_email = result.scalars().first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists"
            )

    user_update_data = update_data.model_dump(exclude_unset=True)
    for field, value in user_update_data.items():
        setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return user


# --------------------------------
# User Update endpoint
# -------------------------------
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not Found"
        )
    await db.delete(user)
    await db.commit()
