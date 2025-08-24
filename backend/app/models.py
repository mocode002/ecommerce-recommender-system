from pydantic import BaseModel, Field
from typing import List, Optional

class SingleReview(BaseModel):
    overall: int
    reviewText: str
    reviewTime: str
    reviewerID: str
    reviewerName: str

class ReviewCreate(BaseModel):
    overall: int
    reviewText: str
    reviewTime: str
    reviewerID: str
    reviewerName: str

class ReviewWrapper(BaseModel):
    product_id: str = Field(..., alias="_id")  # now you can access it with data.product_id
    review: ReviewCreate

    class Config:
        allow_population_by_field_name = True

class ReviewDocument(BaseModel):
    _id: str
    reviews: List[SingleReview]

class Product(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    category: List[str]
    description: List[str]
    title: str
    feature: List[str]
    brand: str
    main_cat: str
    price: str
    imageURLHighRes: List[str]
    cleaned_price: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

class SimilarItem(BaseModel):
    _id: str
    similar_items: List[str]
