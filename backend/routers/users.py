from typing import Annotated

import models
import sqlalchemy.orm
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from schemas import PostResponse, UserCreate, UserResponse, UserUpdate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


# --------------------------
# User creation endpoint
# --------------------------
@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Annotated[AsyncSession, Depends(get_db)]):
    username_result = await db.execute(
        select(models.User).where(models.User.username == user.username)
    )
    existing_user = username_result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists"
        )

    email_result = await db.execute(
        select(models.User).where(models.User.email == user.email)
    )
    existing_email = email_result.scalars().first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists"
        )

    new_user = models.User(username=user.username, email=user.email)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


# --------------------------------
# Getting  all users endpoint
# -------------------------------
@router.get("", response_model=list[UserResponse])
async def get_all_user(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.User))
    users = result.scalars().all()
    return users


# --------------------------------------
# Getting single User  endpoint
# ---------------------------------------
@router.get("/{user_id}", response_model=UserResponse)
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
@router.patch("/{user_id}", response_model=UserResponse)
async def user_update(
    user_id: int, update_data: UserUpdate, db: Annotated[AsyncSession, Depends(get_db)]
):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if update_data.username is not None and update_data.username != user.username:
        result = await db.execute(
            select(models.User).where(models.User.username == update_data.username)
        )
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists",
            )

    if update_data.email is not None and update_data.email != user.email:
        result = await db.execute(
            select(models.User).where(models.User.email == update_data.email)
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
