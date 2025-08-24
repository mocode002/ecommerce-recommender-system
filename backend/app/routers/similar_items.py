from fastapi import APIRouter, HTTPException
from app.database import db
from app.models import SimilarItem
from app.models import Product 

router = APIRouter()

@router.get("/similar-items/{item_id}", response_model=list[Product])
async def get_similar_products(item_id: str):
    similar = await db.similar_items.find_one({"_id": item_id})
    if not similar or "similar_items" not in similar:
        raise HTTPException(status_code=404, detail="Similar items not found")

    similar_ids = similar["similar_items"]

    # Fetch full product documents
    products_cursor = db.products.find({"_id": {"$in": similar_ids}})
    products = await products_cursor.to_list(length=len(similar_ids))

    return products
