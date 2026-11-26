from typing import Annotated

import models
from auth import currentUser
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from schemas import PostCreate, PostResponse, PostUpdate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

router = APIRouter()


# --------------------------------
# Getting home / posts endpoint
# -------------------------------
@router.get("", response_model=list[PostResponse])
@router.get("/", response_model=list[PostResponse])
async def home_page(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        select(models.Post).options(selectinload(models.Post.author)).order_by(models.Post.date_posted.desc())
    )
    posts = result.scalars().all()
    return posts


# --------------------------------
# Getting single post endpoint
# -------------------------------
@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        select(models.Post)
        .options(selectinload(models.Post.author))
        .where(models.Post.id == post_id)
    )
    post = result.scalars().first()
    if post:
        return post
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not Found")


# --------------------------------
# Creating  posts endpoint
# -------------------------------
@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreate, current_user:currentUser, db: Annotated[AsyncSession, Depends(get_db)]):
    new_post = models.Post(title=post.title.capitalize(), content=post.content.capitalize(), user_id=current_user.id)
    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)
    result = await db.execute(
        select(models.Post)
        .options(selectinload(models.Post.author))
        .where(models.Post.id == new_post.id)
    )

    new_post = result.scalars().first()
    return new_post


# --------------------------------
# Fully Updating  posts endpoint
# -------------------------------
@router.put("/{post_id}", response_model=PostResponse)
async def full_post_update(
    post_id: int, post_data: PostCreate ,current_user:currentUser, db: Annotated[AsyncSession, Depends(get_db)]
):
    result = await db.execute(
        select(models.Post)
        .options(selectinload(models.Post.author))
        .where(models.Post.id == post_id)
    )
    post = result.scalars().first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Post not Found"
        )

    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You are not authorized to update this post.")
    post.title = post_data.title
    post.content = post_data.content
    await db.commit()
    await db.refresh(post)
    return post


# --------------------------------
# partially Updating  posts endpoint
# -------------------------------
@router.patch("/{post_id}", response_model=PostResponse)
async def partial_post_update(
    post_id: int, post_data: PostUpdate,current_user:currentUser, db: Annotated[AsyncSession, Depends(get_db)]
):
    result = await db.execute(
        select(models.Post)
        .options(selectinload(models.Post.author))
        .where(models.Post.id == post_id)
    )
    post = result.scalars().first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Post not Found"
        )

    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You are not authorized to update this post.")

    update_data = post_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)

    await db.commit()
    await db.refresh(post)
    return post


# --------------------------------
# Deleting  posts endpoint
# -------------------------------
@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: int,current_user:currentUser, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.Post).where(models.Post.id == post_id))
    post = result.scalars().first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Post not found"
        )
    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You are not authorized to delete this post.")
    await db.delete(post)
    await db.commit()
