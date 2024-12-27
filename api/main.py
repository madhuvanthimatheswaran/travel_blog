from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from datetime import datetime
import json
import requests

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database initialization
def init_db():
    conn = sqlite3.connect('travel_blog.db')
    c = conn.cursor()
    
    # Create posts table
    c.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author_id TEXT NOT NULL,
            author_name TEXT NOT NULL,
            location TEXT NOT NULL,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            tags TEXT
        )
    ''')
    
    # Create comments table
    c.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            author_id TEXT NOT NULL,
            author_name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts (id)
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# Pydantic models
class PostBase(BaseModel):
    title: str
    content: str
    location: str
    author_id: str
    author_name: str
    image_url: str | None = None
    tags: list[str] = []

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    created_at: str

class CommentBase(BaseModel):
    content: str
    author_id: str
    author_name: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    post_id: int
    created_at: str

# API endpoints
@app.get("/api/posts")
async def get_posts():
    conn = sqlite3.connect('travel_blog.db')
    c = conn.cursor()
    
    c.execute('SELECT * FROM posts ORDER BY created_at DESC')
    posts = c.fetchall()
    
    conn.close()
    
    return [
        Post(
            id=post[0],
            title=post[1],
            content=post[2],
            author_id=post[3],
            author_name=post[4],
            location=post[5],
            image_url=post[6],
            created_at=post[7],
            tags=json.loads(post[8]) if post[8] else []
        )
        for post in posts
    ]

@app.get("/api/posts/{post_id}")
async def get_post(post_id: int):
    conn = sqlite3.connect('travel_blog.db')
    c = conn.cursor()
    
    c.execute('SELECT * FROM posts WHERE id = ?', (post_id,))
    post = c.fetchone()
    
    conn.close()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return Post(
        id=post[0],
        title=post[1],
        content=post[2],
        author_id=post[3],
        author_name=post[4],
        location=post[5],
        image_url=post[6],
        created_at=post[7],
        tags=json.loads(post[8]) if post[8] else []
    )

@app.post("/api/posts")
async def create_post(post: PostCreate):
    conn = sqlite3.connect('travel_blog.db')
    c = conn.cursor()
    
    c.execute('''
        INSERT INTO posts (title, content, author_id, author_name, location, image_url, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        post.title,
        post.content,
        post.author_id,
        post.author_name,
        post.location,
        post.image_url,
        json.dumps(post.tags)
    ))
    
    post_id = c.lastrowid
    conn.commit()
    conn.close()
    
    return {"id": post_id, "message": "Post created successfully"}

@app.get("/api/posts/{post_id}/comments")
async def get_comments(post_id: int):
    conn = sqlite3.connect('travel_blog.db')
    c = conn.cursor()
    
    c.execute('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC', (post_id,))
    comments = c.fetchall()
    
    conn.close()
    
    return [
        Comment(
            id=comment[0],
            post_id=comment[1],
            content=comment[2],
            author_id=comment[3],
            author_name=comment[4],
            created_at=comment[5]
        )
        for comment in comments
    ]

@app.post("/api/posts/{post_id}/comments")
async def create_comment(post_id: int, comment: CommentCreate):
    conn = sqlite3.connect('travel_blog.db')
    c = conn.cursor()
    
    c.execute('''
        INSERT INTO comments (post_id, content, author_id, author_name)
        VALUES (?, ?, ?, ?)
    ''', (
        post_id,
        comment.content,
        comment.author_id,
        comment.author_name
    ))
    
    comment_id = c.lastrowid
    conn.commit()
    conn.close()
    
    return {"id": comment_id, "message": "Comment created successfully"}