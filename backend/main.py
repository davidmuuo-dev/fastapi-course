from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, status
from schemas import PostCreate, PostResponse

app = FastAPI()
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
posts: list[dict] = [
    {
        "id": 1,
        "author": "David Muuo",
        "title": "FastAPI is awesome",
        "content": "This framework is super fast and easy to learn. I built my first API in 10 minutes!",
        "date_posted": "April 20, 2024",
    },
    {
        "id": 2,
        "author": "David Muuo",
        "title": "Why I love Python",
        "content": "Python makes backend development simple. From data analysis to web APIs, it does everything.",
        "date_posted": "April 21, 2024",
    },
    {
        "id": 3,
        "author": "Sarah Kim",
        "title": "Learning to Code in 2024",
        "content": "Started my coding journey 3 months ago. Consistency is more important than speed.",
        "date_posted": "April 22, 2024",
    },
    {
        "id": 4,
        "author": "John Doe",
        "title": "My Expense Tracker Project",
        "content": "Building an expense tracker to manage my daily spending. Frontend is React, backend is FastAPI.",
        "date_posted": "May 01, 2024",
    },
]


@app.get("/", response_model=list[PostResponse])
@app.get("/posts", response_model=list[PostResponse])
def home_page():
    return posts


@app.get("/posts/{post_id}", response_model=PostResponse)
def get_post(post_id: int):
    for post in posts:
        if post["id"] == post_id:
            return post
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not Found")


@app.post("/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(post: PostCreate):
    new_id = max(p["id"] for p in posts) + 1 if posts else 1
    new_post = {
        "id": new_id,
        "author": post.author,
        "title": post.title,
        "content": post.content,
        "date_posted": "May 23,2027",
    }
    posts.append(new_post)
    return new_post
