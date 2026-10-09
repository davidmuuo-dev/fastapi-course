from fastapi import FastAPI

app = FastAPI()


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
    {
        "id": 5,
        "author": "David Muuo",
        "title": "Deploying FastAPI",
        "content": "Finally deployed my API. The feeling of seeing your app live is unmatched. Next stop is Docker.",
        "date_posted": "May 05, 2024",
    },
]


@app.get("/")
def home():
    return posts


@app.get("/posts", include_in_schema=False)
def get_posts():
    return posts
