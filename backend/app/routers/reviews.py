from fastapi import APIRouter, HTTPException
from app.database import db
from app.models import ReviewCreate, ReviewDocument, ReviewWrapper
from pymongo.errors import DuplicateKeyError

router = APIRouter()

@router.get("/reviews/{item_id}", response_model=ReviewDocument)
async def get_review_by_id(item_id: str):
    result = await db.reviews.find_one({"_id": item_id})
    if not result:
        raise HTTPException(status_code=404, detail="Review not found")
    return result

@router.post("/reviews")
async def add_review(data: ReviewWrapper):
    update_result = await db.reviews.update_one(
        {"_id": data.product_id},
        {"$push": {"reviews": data.review.model_dump()}}
    )
    if update_result.modified_count == 1:
        return {"message": "Review added successfully"}
    else:
        return {"message": "Product not found or review not added"}, 404
