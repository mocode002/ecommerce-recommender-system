from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products, reviews, similar_items

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] to allow all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],  # or specify: ["GET", "POST", ...]
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(reviews.router)
app.include_router(similar_items.router)