from fastapi import APIRouter, HTTPException
from app.database import db
from app.models import Product
from random import sample
from typing import List

router = APIRouter()

@router.get("/products/{item_id}", response_model=Product)
async def get_product_by_id(item_id: str):
    result = await db.products.find_one({"_id": item_id})
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return result

@router.get("/products", response_model=List[Product])
async def get_random_products():
    cursor = db.products.aggregate([{ "$sample": { "size": 32 } }])
    products = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])  # convert ObjectId to string
        products.append(doc)
    return products